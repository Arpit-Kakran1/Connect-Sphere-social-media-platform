
import { setAuthUser } from "@/redux/authSlice";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { useState } from "react";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { setClearNotification } from "@/redux/rtnSlice";

const LeftSideBar = () => {

  const logoutItem = { icon: <LogOut size={24} />, text: "logout" };

  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });
      if (res.data.message) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sidebarHandler = (textType) => {
    if (textType.toLowerCase() === "logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user._id}`);
    } else if (textType == "Home") {
      navigate("/")
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  }

  const sidebarItems = [
    { icon: <Home size={24} />, text: "Home" },
    { icon: <Search size={24} />, text: "Search" },
    { icon: <TrendingUp size={24} />, text: "Explore" },
    { icon: <MessageCircle size={24} />, text: "Messages" },
    { icon: <Heart size={24} />, text: "Notifications" },
    { icon: <PlusSquare size={24} />, text: "Create" },
    {
      icon: (
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          <AvatarImage src={user?.profilePicture} alt="avatar" className="object-cover w-full h-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
  ];


  const mobileBottomItems = sidebarItems.filter(item => ["Home", "Create", "Profile"].includes(item.text));
  const notificationItem = sidebarItems.find(item => item.text === "Notifications");
  const messageItem = sidebarItems.find(item => item.text === "Messages");

  return (
    <>
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex-col p-6 z-10">
        <div className="mb-3">
          <h1 className="text-2xl font-bold">Connect Sphere</h1>
        </div>
        <nav className="flex-grow">
          <div className="flex flex-col gap-4">
            {sidebarItems.map((item, index) => {
              if (item.text === "Notifications") {
                return (
                  <Popover key={index} onOpenChange={(open) => {
                    if (!open) dispatch(setClearNotification());

                  }}>
                    <PopoverTrigger asChild>
                      <div className="relative flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
                        {item.icon}
                        <span className="font-medium text-md">{item.text}</span>
                        {likeNotification.length > 0 && (
                          <div className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {likeNotification.length}
                          </div>
                        )}
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="w-80">
                      <div>
                        {
                          likeNotification.length === 0 ? (<p>No notifications yet</p>) : (likeNotification.map((notification) => {
                            console.log(notification)
                            return (
                              <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                <Avatar size="h-8 w-8 rounded-full overflow-hidden">
                                  <AvatarImage className="object-cover w-8 h-8 rounded-full" src={notification.userDetails?.profilePicture} />

                                </Avatar>
                                <p><span>{notification.userDetails?.username} liked your post</span></p>
                              </div>
                            )
                          }))
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              }
              return (
                <div key={index} onClick={() => sidebarHandler(item.text)} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
                  {item.icon}
                  <span className="font-medium text-md">{item.text}</span>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Here the mobile responsive starts */}
        <div>
          <div onClick={() => sidebarHandler(logoutItem.text)} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200">
            {logoutItem.icon}
            <span className="font-medium text-md">{logoutItem.text}</span>
          </div>
        </div>
      </div>

      <header className="fixed w-full h-16 bg-white border-b z-10 flex md:hidden items-center justify-between px-4">
        <div onClick={() => sidebarHandler(logoutItem.text)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          {logoutItem.icon}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-2xl font-bold">Connect Sphere</h1>
        </div>

        <div className="flex items-center gap-2">
          <Popover onOpenChange={(open) => { if (!open) dispatch(setClearNotification()) }}>
            <PopoverTrigger asChild>
              <div className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                {notificationItem.icon}
                {likeNotification.length > 0 && (
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {likeNotification.length}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div>
                {
                  likeNotification.length === 0 ? (<p>No notifications yet</p>) : (likeNotification.map((notification) => {
                    return (
                      <div key={notification.userId} className='flex items-center gap-2 my-2'>
                        <Avatar size="h-8 w-8 rounded-full overflow-hidden">
                          <AvatarImage className="h-8 rounded-full w-8 object-cover" src={notification.userDetails?.profilePicture} />
                          <AvatarFallback />
                        </Avatar>
                        <p><span>{notification.userDetails?.username} liked your post</span></p>
                      </div>
                    )
                  }))
                }
              </div>
            </PopoverContent>
          </Popover>

          <div onClick={() => sidebarHandler(messageItem.text)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            {messageItem.icon}
          </div>
        </div>
      </header>
      //Mobile
      <nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t z-10 flex md:hidden items-center justify-around px-2">
        {
          mobileBottomItems.map((item) => (
            <div key={item.text} onClick={() => sidebarHandler(item.text)} className="p-2 cursor-pointer rounded-full hover:bg-gray-100">
              {item.text === "Profile" ? (
                <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                  <AvatarImage src={user?.profilePicture} alt="avatar" className="object-cover w-8 h-8 rounded-full" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ) : (
                item.icon
              )}
            </div>
          ))
        }
      </nav>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSideBar;

