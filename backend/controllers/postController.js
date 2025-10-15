import sharp from 'sharp';
import cloudinary from 'cloudinary';
import {Post} from '../models/post-model.js';
import User from '../models/user-model.js'
import {Comment} from '../models/comment-model.js'
import { getRecieversSocketId, io } from '../sockets/socket.js';

//Creating the new post
export const addNewPost = async (req, res) => {
    try {
        // --- FIX #1: Destructure 'caption' from req.body ---
        const { caption } = req.body;
        const image = req.file;
        // --- FIX #2: Get the user ID from req.user ---
        const authorId = req.id; 

        if (!caption) {
             return res.status(400).json({ message: "Caption is required." });
        }
        if (!image) {
             return res.status(400).json({ message: "Image is required." });
        }
        
        // Image processing with sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // Buffer to data URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption, // Now this is a string, as expected
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.post.push(post._id);
            await user.save();
        }

        await post.populate({ path: "author", select: "-password" });

        return res.status(201).json({
            message: "Post Added",
            post,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, please try again." });
    }
}

//Getting all the user Posts

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

//Getting the user posts
export const getUserPost = async(req, res) =>{
  try {
    const authorId=req.id
    const post = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
      path: "author",
      select: "usernaem,profilePicture",
      populate: ({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select:"username,profilePicture"
        }
      })
    });
    return res.status(200).json({
      posts,
      success:true
    })

  } catch (error) {
    console.log(error);
    
  }
}

//Liking the post
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found", success: false });

    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    const user =await User.findById(likeKrneWalaUserKiId).select("username profilePicture");
    const postOwnerId = post.author.toString();
    if (postOwnerId != likeKrneWalaUserKiId) {
  
      const notification = {
        type: "like",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message:"your post is liked"
      }
      const postOwnerSocketId = getRecieversSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }

    return res.status(200).json({ message: "Post Liked", success: true });

    
  } catch (error) {
    console.log(error)
  }


}

//Dislike Post Logic
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post Not Found", success: false });

    
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

     const user =await User.findById(likeKrneWalaUserKiId).select("username userProfile");
    const postOwnerId = post.author.toString();
    if (postOwnerId != likeKrneWalaUserKiId) {
      
      const notification = {
        type: "dislike",
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message:"you post is disliked"
      }
      const postOwnerSocketId = getRecieversSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({ message: "Post unliked", success: true });


  } catch (error) {
    console.log(error)
  }
}

//Comment Add Logic Here
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;

    const { text } = req.body;
    const post =await Post.findById(postId);

    if (!text) return res.status(400).json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentUserId,
      post: postId
    })
      await comment.populate({ path: "author", select: "username profilePicture" });

    await post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      success: true,
      comment
    })
  } catch (error) {
    console.log(error);
  }
}

//Getting all comments
export const getComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = Comment.findById({ post: postId }).populate("author", "username,profilePicture");

    if (!comments) return res.status(404).json({ message: "No comments found", success: false });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
}

//Delete the post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post =await  Post.findById( postId );

    if (!post) return res.status(400).json({ message: "No post found", success: false });

    //Check if the loged in user is the owner of the post
    if (post.author.toString() != authorId) return res.status(403).json({ message: "Unauthorized user cannot delete the post", success: false });

    //Deleting the post
    await Post.findByIdAndDelete(postId);

    //Also removing the post id from users model
    let user = await User.findById(authorId);
    await user.post.filter(id => id.toString() != postId);
    await user.save();
    

    //Delete the associated post comments
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({ message: "Post Deleted", success: true });
  } catch (error) {
    console.log(error);
  }
}


//Bookmarks or saving any post

export const bookmarkPost = async (req, res) => {
    try {
        const authorId = req.id;
        const postId = req.params.id;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found", success: false });
        }

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Check if the post ID is already in the user's bookmarks
        const postIndex = user.bookmarks.indexOf(post._id);

        if (postIndex > -1) {
            // Already bookmarked -> then remove from the bookmarks
            user.bookmarks.splice(postIndex, 1); // Remove the post ID from the array
            await user.save();
            return res.status(200).json({ type: "Unsaved", message: "Post removed from bookmarks", success: true });
        } else {
            // Not bookmarked -> add the post to bookmarks
            user.bookmarks.push(post._id); // Add the post ID to the array
            await user.save();
            return res.status(200).json({ type: "Saved", message: "Post added to bookmarks", success: true });
        }

    } catch (error) {
        console.log("Error in bookmarkPost controller: ", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};