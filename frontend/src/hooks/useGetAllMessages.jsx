import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.chat);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });

        if (res.data.success && Array.isArray(res.data.messages)) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(error);

        dispatch(setMessages([]));
      }
    };

    if (selectedUser?._id) {
      fetchMessages();
    }

  }, [selectedUser, dispatch]);
};

export default useGetAllMessages;