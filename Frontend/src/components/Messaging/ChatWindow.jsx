import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMessages, sendMessage } from "../../api/message";
import socket from "@/lib/socket";
import { ScaleLoader } from "react-spinners";
import { ChevronLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { chatSelected } from "../../redux/features/selectChat";
import { SendHorizonal } from "lucide-react";

function ChatWindow({ className }) {
  const chatInfo = useSelector((state) => state.selectedChat.chatInfo);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await getMessages(
        chatInfo.conversationId,
        setLoading
      );

      if (data) {
        console.log(data);
        setMessages(data.messages);
      }

      if (error) {
        console.error(error);
      }
    };

    if (chatInfo.conversationId) {
      fetchMessages();
    }
  }, [chatInfo.conversationId]);

  useEffect(() => {
    socket.on("sendMessage", (newMessage) => {
      console.log("New message received via socket:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => socket.off("sendMessage");
  }, [messages]);

  const handleSendMessage = async () => {
    // console.log(chatInfo.receiverId);
    if (!message.trim()) return;
    const { data, error } = await sendMessage(
      chatInfo.receiverId,
      chatInfo.conversationId,
      { content: message }
    );

    if (data) {
      setMessages((prev) => [...prev, data.message]);
    }

    if (error) {
      console.log(error);
    }

    setMessage("");
  };

  const closeChat = () => {
    dispatch(chatSelected({ isOpen: false }));
  };

  return (
    <div
      className={`${chatInfo.isOpen ? "flex" : "hidden"} flex-1 
       flex-col md:border-l-2 h-auto md:border-gray-700 p-6 md:flex ${className}`}
    >
      {loading && (
        <ScaleLoader
          width={6}
          height={80}
          radius={2}
          margin={6}
          color="skyblue"
          className="mx-auto text-center my-28"
        />
      )}
      <div>
        {chatInfo.conversationId ? (
          <>
            <div className="text-md bg-gray-800 shadow-md p-4 text-xl font-semibold">
              <div className="flex items-center gap-2">
                <ChevronLeft
                  className="cursor-pointer block md:hidden"
                  onClick={closeChat}
                />
                <p>{chatInfo.companyName}</p>
                <p>
                  Chatting with {chatInfo.firstName} {chatInfo.lastName}
                </p>
              </div>
            </div>

            {!messages ||
              (messages.length < 1 && (
                <p className="my-10 text-gray-500 text-center">
                  Say hi to start conversation
                </p>
              ))}

            <div className="flex flex-col bg-gray-900 px-0 py-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex items-end mb-3 ${
                    userInfo._id === message.senderId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`text-white p-3  rounded-lg max-w-[75%] break-words ${
                      userInfo._id === message.senderId
                        ? "bg-blue-500 self-end"
                        : "bg-gray-500 self-start"
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.content}</p>
                    <p className="text-right text-sm  text-gray-200 pt-2">
                      {new Date(message.createdAt).toLocaleTimeString(
                        navigator.language,
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No chat selected...</p>
        )}
        {chatInfo.conversationId && (
          <div className="md:p-3 md:bg-gray-800 sticky bottom-0 flex items-center gap-2">
            <textarea
              className="flex-1 text-sm md:text-md px-3 py-2 md:p-3 border rounded-lg bg-gray-700 text-white 
               placeholder-gray-400  resize-none min-h-[48px] w-full 
               focus:outline-none"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents newline in textarea
                  handleSendMessage();
                }
              }}
            />
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex-shrink-0 whitespace-nowrap hidden md:block"
              onClick={handleSendMessage}
            >
              Send
            </button> */}
            <button
              className="bg-blue-500 text-white px-1 py-1 md:px-2 md:py-2 lg:px-3 lg:py-2 rounded-lg flex-shrink-0 whitespace-nowrap disabled:bg-gray-500"
              onClick={handleSendMessage}
              disabled={!message}
            >
              <SendHorizonal />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
