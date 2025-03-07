import ChatWindow from "@/components/Messaging/ChatWindow";
import ChatSidebar from "@/components/Messaging/ChatSidebar";


const Conversation = () => {
  return (
    <div className="flex bg-slate-900 text-white mb-10 mx-10 md:mx-20">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
};

export default Conversation;
