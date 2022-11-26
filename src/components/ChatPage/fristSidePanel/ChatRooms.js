//클래스 컴포넌트(훅사용불가)
import React, { Component } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
import {
  getDatabase,
  ref,
  onChildAdded,
  push,
  child,
  update,
  off,
} from "firebase/database";

export class ChatRooms extends Component {
  state = {
    show: false,
    over: false,
    name: "",
    description: "",
    chatRoomsRef: ref(getDatabase(), "chatRooms"),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
    mouseOverChatRoom: "",
  };

  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
    off(this.state.chatRoomsRef);
  }

  AddChatRoomsListeners = () => {
    //db에서 실시간 가져오기
    let chatRoomsArray = [];

    onChildAdded(this.state.chatRoomsRef, (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      this.setState({ chatRooms: chatRoomsArray }, () =>
        this.setFirstChatRoom()
      );
    });
  };

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id });
    }
    this.setState({ firstLoad: false });
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });
  plusOver = () => this.setState({ over: true });
  plusOut = () => this.setState({ over: false });

  handleSubmit = (e) => {
    e.preventDefault(); //임의로 페이지 refresh 막기
    const { name, description } = this.state;

    if (this.isFormValid(name)) {
      //유효성 체크
      this.addChatRoom();
    }
  };

  isFormValid = (name) => name;

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };

  /** 마우스 hover 이벤트 */
  mouseOverChatRoom = (room) => {
    this.setState({ mouseOverChatRoom: room.id });
  };

  mouseOutChatRoom = () => {
    this.setState({ mouseOverChatRoom: "" });
  };

  renderChatRooms = (chatRooms) =>
    chatRooms.length > 0 &&
    chatRooms.map((room) => (
      <div
        style={{
          backgroundColor: "#36393F",
          width: 50,
          height: 50,
          borderRadius: 100,
          fontSize: 10,
          textAlign: "center",
          lineHeight: 5,
          marginBottom: 7,
          cursor: "pointer",
        }}
      >
        <li
          key={room.id}
          style={{
            backgroundColor:
              (room.id == this.state.activeChatRoomId && "#5865F9") ||
              (room.id == this.state.mouseOverChatRoom && "#5865F9") ||
              (this.state.mouseOverChatRoom == "" && "#36393F"),
            width: 50,
            height: 50,
            borderRadius: 100,
            fontSize: 10,
            textAlign: "center",
            lineHeight: 5,
            marginBottom: 7,
            cursor: "pointer",
          }}
          onClick={() => this.changeChatRoom(room)}
          onMouseOver={() => this.mouseOverChatRoom(room)}
          onMouseOut={() => this.mouseOutChatRoom()}
        >
          {room.name}
        </li>
      </div>
    ));

  addChatRoom = async () => {
    const key = push(this.state.chatRoomsRef).key; //자동생성키
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };

    try {
      //db upload
      await update(child(this.state.chatRoomsRef, key), newChatRoom);
      this.setState({
        name: "",
        description: "",
        show: false,
      });
    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
      <div>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          style={{ backgroundColor: "#00000060" }}
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#37393F", color: "white" }}
          >
            <Modal.Title>공개방 생성</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ backgroundColor: "#37393F", color: "white" }}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  onChange={(e) => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="방 이름을 입력하세요"
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer style={{ backgroundColor: "#37393F", color: "white" }}>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              style={{ backgroundColor: "#5865F9", color: "#ffffff" }}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        <div
          onClick={this.handleShow}
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            width: 50,
            height: 50,
            backgroundColor:
              (this.state.over == false && "#36393F") ||
              (this.state.over == true && "#3BA55D"),
            borderRadius: 100,
            cursor: "pointer",
          }}
          onMouseOver={() => this.plusOver()}
          onMouseOut={() => this.plusOut()}
        >
          <FaPlus
            style={{
              position: "absolute",
              left: 15,
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(ChatRooms);
