import React from "react";
import moment from "moment";

function Message({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();

  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid;
    }
  };

  return (
    <div style={{ marginBottom: "0px", display: "flex", }}>
      <img
        style={{ borderRadius: "10px" }}
        width={38}
        height={38}
        className="mr-3"
        src={message.user.image}
        alt={message.user.name}
      />
      <div
        style={{
          fontSize:15,
          paddingLeft: "3px",
          marginLeft: "5px",
          
          backgroundColor: isMessageMine(message, user),
        }}
      >
        <h6>
          {message.user.name}{" "}
          <span style={{ fontSize: "8px", color: "gray" }}>
            {timeFromNow(message.timestamp)}
          </span>
        </h6>
        {isImage(message) ? (
          <img style={{ maxWidth: "300px" }} alt="이미지" src={message.image} />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
}

export default Message;
