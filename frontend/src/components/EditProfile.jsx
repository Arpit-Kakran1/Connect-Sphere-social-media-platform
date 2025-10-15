import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector(store => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(""); // State for image preview

  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandle = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    // Only append the photo if a new one was selected
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      console.log(res.data);

      if (res.data.sucess) {
        dispatch(setAuthUser(res.data.user));
        navigate(`/profile/${user._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Ensure loading is always set to false
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto p-4 md:p-0">
      <section className="flex flex-col gap-8 w-full my-8">
        <h1 className="font-bold text-2xl">Edit Profile</h1>

        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-4'>
            <Avatar className="h-16 w-16">
              <AvatarImage src={preview || user?.profilePicture} alt="profile_picture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-bold text-md'>{user?.username}</h1>
              <span className='text-sm text-gray-600'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>

          <input ref={imageRef} type='file' accept="image/*" className='hidden' onChange={fileChangeHandler} />
          <Button
            onClick={() => imageRef?.current.click()}
            className='bg-blue-500 h-9 text-white hover:bg-blue-600'>
            Change photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-lg mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value }, input.bio = " ")}
            className="focus-visible:ring-transparent"
            name="bio"
          />
        </div>
        <div>
          <h1 className="font-bold text-lg mb-2">Gender</h1>
          <div className="flex justify-between items-center">
            <Select value={input.gender} onValueChange={selectChangeHandler}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <div className="items-end">
              {loading ? (
                <Button disabled className="bg-blue-500 text-white">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please Wait
                </Button>
              ) : (
                <Button onClick={editProfileHandle} className="bg-blue-500 text-white hover:bg-blue-600">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;