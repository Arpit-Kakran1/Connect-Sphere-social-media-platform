import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  const imageRef = useRef()

  const dispatch = useDispatch();

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption)
    if (imagePreview) {
      formData.append("image", file);
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData, {
        headers: {
          "Content-type": "multipart/form-data"
        },
        withCredentials: true
      });
      if (res.data.success) {
        console.log(res.data)
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const fileChangeHandler = async (e) => {
    let file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
          <div className="flex">
            <Avatar>
              <AvatarImage src="" alt="image">
                <AvatarFallback>CN</AvatarFallback>
              </AvatarImage>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">{user?.username || "Username"}</h1>
              <span className="text-grey text-xs">Bio Here..</span>
            </div>
          </div>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="write the caption" />
          {
            imagePreview && (
              <div className='w-full h-64 flex items-center justify-center'>
                <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
              </div>
            )
          }
          {
            imagePreview && (
              loading ? (
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  please wait
                </Button>
              ) : (
                <Button className="w-full" onClick={createPostHandler}>Post</Button>
              )
            )
          }
          <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler}></input>
          <Button onClick={() => imageRef.current.click()} className="mx-auto bg-[#0095f6] hover:bg-[#005a97]">Select From Computer</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreatePost
