import React from "react";
import Logo from "./Logo";
import DirectMessages from "./DirectMessages";
import UserPanel from "./UserPanel";

function SidePanel() {
  return (
    <div
      style={{
        backgroundColor: "#2F3136",
        padding: "0.4rem",
        minHeight: "100vh",
        height: "100%",
        color: "white",
        minWidth: "25px",
      }}
    >
      {/* 로고 */}
      <Logo />

      {/* 친구목록 */}
      <DirectMessages />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "275px",
          left: 90,
          backgroundColor: "#292B2F",
          height:60
        }}
      >
        <UserPanel />
      </div>
    </div>
  );
}

export default SidePanel;
