import User from '../models/user-model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/dataURI.js';
import cloudinary from '../utils/cloudinary.js';
import {Post} from '../models/post-model.js'

//Register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success:false
      })
    }

    const user = await User.findOne({ email });
    if (user) {
       return res.status(401).json({
        message: "Try different email",
        success:false
      }) 
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    return res.status(201).json({
        message: "Account Created Succesfully",
        success:true
      })
  } catch (error) {
    console.log("error",error)
  }
}

//Login
export const login = async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing",
        success:false
      })
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success:false
      })
    }
    const isPassword =await bcrypt.compare(password, user.password);
    if(!isPassword){
      return res.status(401).json({
        message: "Incorrect Email or Password",
        success:false
      })
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
    //Populate each post id in the post array
    const populatedPost = await Promise.all(
      user.post.map(async(postID) => {
        const post = await Post.findById(postID);
        if (!post) {
                    return null;
                }
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    )
    user = {
      _id: user._id,
      username:user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts:populatedPost
    }

    return res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back `,
      success: true,
      user
    })
  } catch (error) {
    console.log("Error occured", error);
  }
}

//Logout
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Succesfully",
      sucess:true
    })
  } catch (error) {
    console.log(error)
  }
}

//Get Profile
export const getProfile = async (req, res)=>{
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:"post",createdAt:-1}).populate("bookmarks");
    return res.status(200).json({
      user,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}

//Edit Profile
export const editProfile = async (req, res) => {
  try {
    
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse=await cloudinary.uploader.upload(fileUri);
    }

    const user =await  User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        sucess:false
      })
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
        message: "Profile Updated",
        sucess:true,
        user
      })

  } catch (error) {
    console.log(error)
  }
}

//Suggestions in the feed
export const suggestedUser = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUser) return res.status(400).json({
      message: "Currently Do Not Have Any User",
    })

    return res.status(201).json({
      success:true,
      users:suggestedUser
    })
  } catch (error) {
    console.log(error);
    
  }
}

//Follow Or Unfollow
export const followOrunfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; //im following
    const jiskoFollowKrunga = req.params.id;

    if (followKrneWala === jiskoFollowKrunga) {
      return res.status(400).json({
        message: "You Cannot follow or unfollow yourself",
        success:false
      })
    }

    const user = await User.findById( followKrneWala );
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) return res.status(400).json({
      message: "User not found",
      success:false
    })

    //ab hm yeh check krege k follow krege ya unfollow

    const isFollowing = user.following.includes(jiskoFollowKrunga);
    if (isFollowing) {
      //Unfollow logic ayega
       await Promise.all([
        User.updateOne({ _id: followKrneWala }, {$pull:{ following: jiskoFollowKrunga } }),
        User.updateOne({_id:jiskoFollowKrunga},{$pull:{followers:followKrneWala}})
      ])
       return res.status(200).json({
      message:"Unfollow successfully",
      success:true
    })
    } else {
      //follow logic ayega
      await Promise.all([
        User.updateOne({ _id:followKrneWala }, {$push:{ following: jiskoFollowKrunga } }),
        User.updateOne({_id:jiskoFollowKrunga},{$push:{followers:followKrneWala}})
      ])
       return res.status(200).json({
      message:"Follow successfully",
      success:true
    })
    }
   
  } catch (error) {
    console.log(error);
    
  }
}