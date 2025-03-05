import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatSelected, addCompanyInfo } from "../../redux/features/selectChat";
import { getConversations } from "../../api/message";
import socket from "@/lib/socket";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="p-4 bg-gray-700 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
    </div>
  );
};

function ChatSidebar({ className }) {
  const chatInfo = useSelector((state) => state.selectedChat.chatInfo);

  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    const fecthConversation = async () => {
      const { data, error } = await getConversations(user._id, setLoading);
      if (data) {
        console.log(data);
        setConversations(data.conversations);
      }

      if (error) {
        console.error(error);
      }
    };

    if (user) {
      fecthConversation();
    }
  }, []);

  const openChat = (
    conversationId,
    receiverId,
    senderId,
    receiverFirstName,
    receiverLastName,
    senderFirstName,
    senderLastName
  ) => {
    if (user) {
      socket.emit("join", user._id);
    }
    if (conversationId && receiverId && senderId) {
      if (user.accountType === "recruiter") {
        dispatch(
          chatSelected({
            conversationId,
            receiverId,
            isOpen: true,
            firstName: receiverFirstName,
            lastName: receiverLastName,
          })
        );
      } else {
        dispatch(
          chatSelected({
            conversationId,
            receiverId: senderId,
            isOpen: true,
            firstName: senderFirstName,
            lastName: senderLastName,
          })
        );
      }
    }
  };

  return (
    <div
      className={`${
        chatInfo.isOpen ? "hidden" : "block"
      } w-[90%] mx-auto md:block md:w-1/3 bg-slate-900 shadow-md p-4 ${className}`}
    >
      <h1 className="text-3xl gradient-title font-extrabold md:text-3xl lg:text-4xl text-center pb-4">
        All Messages
      </h1>
      {!conversations ||
        (conversations.length < 1 && (
          <div className="p-4">No conversations found</div>
        ))}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {conversations &&
            conversations.length > 0 &&
            conversations.map((c) => (
              <div
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                key={c._id}
                onClick={() => {
                  openChat(
                    c._id,
                    c.receiver._id,
                    c.sender._id,
                    c.receiver.firstName,
                    c.receiver.lastName,
                    c.sender.firstName,
                    c.sender.lastName
                  );
                }}
              >
                <div className="flex justify-between items-center gap-4">
                  <p className="text-sm md:text-wrap">{c.job.title}</p>
                  {c.lastMessageAt ? (
                    <p className="text-sm md:text-wrap">
                      {new Date(c?.lastMessageAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm md:text-wrap">
                      {new Date(c?.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-gray-400">{c.job.companyName}</p>
                <p className="text-md line-clamp-1">{c?.lastMessage || ""}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ChatSidebar;
