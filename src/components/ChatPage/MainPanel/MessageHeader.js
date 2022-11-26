import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100px",
        borderRadius: "4px",
        padding: "1.3rem",
        marginBottom: "1rem",
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              {isPrivateChatRoom ? (
                // <FaLock style={{ marginBottom: "10px" }} />
                '@'
              ) : (
                // <FaLockOpen style={{ marginBottom: "10px" }} />
                '#'
              )}
              {chatRoom && chatRoom.name}
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineSearch />
              </InputGroup.Text>
              <FormControl
                style={{
                  backgroundColor: "#41444B",
                  color: "white",
                }}
                onChange={handleSearchChange}
                placeholder="메세지 검색"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
          <hr></hr>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
