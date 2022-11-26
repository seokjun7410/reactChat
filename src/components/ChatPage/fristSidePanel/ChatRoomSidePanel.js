import React from "react";
import ChatRooms from "./ChatRooms";

function ChatRoomSidePanel() {
  return (
    <div
      style={{
        backgroundColor: "#202225",
        padding: "1rem",
        minHeight: "100vh",
        color: "white",
        minWidth: "200%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <ChatRooms />
    </div>
  );
}

export default ChatRoomSidePanel;
