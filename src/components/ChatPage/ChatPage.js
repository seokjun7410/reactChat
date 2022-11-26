import React from "react";
import ChatRoomSidePanel from "./fristSidePanel/ChatRoomSidePanel";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useSelector } from "react-redux";

function ChatPage() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  

  return (
    <div style={{ display: "flex", width:'100%',height:'100%'}}>
      <div style={{ width: "95px"}}>
        <ChatRoomSidePanel key={currentUser && currentUser.uid} />
      </div>
      <div style={{ width: "300px" }}>
        <SidePanel key={currentUser && currentUser.uid} />
      </div>
      <div style={{ width: "100%", background: "#37393F", color: "white" }}>
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
      </div>
    </div>
  );
}

export default ChatPage;
