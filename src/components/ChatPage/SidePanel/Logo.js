import React, { useRef } from "react";
import { IoIosChatboxes } from "react-icons/io";

function Logo() {
  const inputOpenImageRef = useRef();

  return (
    <div>
      {/* Logo */}
      <h3 style={{ color: "white", fontSize: 20 }}>
        <IoIosChatboxes /> HansungCord
      </h3>
      <hr></hr>
    </div>
  );
}

export default Logo;
