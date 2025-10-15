import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react"
import { Button } from "./ui/button"
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [follow, setFollow] = useState(false);

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    }
    else {
      setText("")
    }
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPost = posts.filter((filterPost) => filterPost._id !== post?._id);
        dispatch(setPosts(updatedPost))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const commentHandler = async () => {

    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        let updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPosts = posts.map(p => {
          if (p._id === post._id) {

            return {
              ...p,
              comments: [...p.comments, res.data.comment]
            };
          }

          return p;
        });

        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const followOrunfollow = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/followOrunfollow/${post?.author._id}`,
        {}, { withCredentials: true });
      console.log(res.data);
      if (res.data.message) {
        setFollow(!follow)
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-full my-4 max-w-sm mx-auto md:max-w-md lg:max-w-md" >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            <AvatarImage className="object-cover w-full h-full" src={post.author.profilePicture} alt="Profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author._id}`} className="cursor-pointer"><h1>{post.author.username}</h1></Link>
            {
              user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
          </div>

        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <Button onClick={followOrunfollow} variant="ghost" className="cursor-pointer  text-[#ED4956] font-bold ">{follow ? "Unfollow" : "Follow"}</Button>
            <Button variant="ghost" className="cursor-pointer  font-bold ">Add to favourites</Button>
            {
              user && user._id === post.author._id && <Button onClick={deleteHandler} variant="ghost" className="cursor-pointer  font-bold ">Delete</Button>
            }

          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full object-cover"
        src={post.image} alt="post_image" />
      <div className="flex items-center justify-between my-2 ">
        <div className="flex items-center gap-3">
          {
            liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
          }

          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }} className="cursor-pointer hover:text-bg-grey-600" />
          <Send className="cursor-pointer hover:text-bg-grey-600" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-bg-grey-600" />
      </div>
      <span className="font-medium block mb-2 " >{postLike} likes</span>
      <p>
        <span className="font-medium">
          {post.username}
        </span>
        {post.caption}
      </p>
      {
        comment.length > 0 && (
          <span onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
        )
      }
      <CommentDialog post={post} commentHandler={commentHandler} open={open} setOpen={setOpen} />
      <div className="flex justify-between">
        <input type="text"
          placeholder="Add a commnet.."
          value={text}
          onChange={changeEventhandler}
          className="outline-none bg-grey-300 text-sm w-full " />
        {
          text && <span onClick={commentHandler} className="text-blue-600 font-sm cursor-pointer">Post</span>
        }
      </div>
    </div>
  )
}

export default Post
