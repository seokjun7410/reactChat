import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import { InputGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getDatabase, ref, set, push, child } from "firebase/database";
import {
  getStorage,
  ref as strRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = ref(getDatabase(), "messages");
  const inputOpenImageRef = useRef();

  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }

    return message;
  };

  const handleSubmit = async (event) => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);
    event.preventDefault();
    //firebase에 메시지를 저장하는 부분
    try {
      await set(push(child(messagesRef, chatRoom.id)), createMessage());
      //보냈으니 원상태로 초기화
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const storage = getStorage();

    const filePath = `${getPath()}/${file.name}`;
    console.log("filePath", filePath);
    const metadata = { contentType: file.type };
    setLoading(true);

    try {
      const storageRef = strRef(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            set(
              push(child(messagesRef, chatRoom.id)),
              createMessage(downloadURL)
            );
            setLoading(false);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{marginTop:10}}>
      <div
        
      >
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <Button
              style={{
                borderRadius: "25px",
                marginLeft: "5px",
                marginRight: "5px",
                borderColor: "#B9BBBE",
                backgroundColor: "#B9BBBE",
                color: "#37393F",
              }}
              onClick={handleOpenImageRef}
            >
              +
            </Button>
            <Form.Control
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              value={content}
              style={{
                backgroundColor: "#41444B",
                color: "white",
                borderRadius: "10px",
                marginRight: "15px",
              }}
              placeholder="메세지 보내기"
            />
          </InputGroup>
        </Form>
      </div>

      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: "red" }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>

      <input
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
