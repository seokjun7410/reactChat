//클래스 컴포넌트(훅 사용 불가)
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
import { getDatabase, ref, onChildAdded } from "firebase/database";

export class DirectMessages extends Component {
  state = {
    usersRef: ref(getDatabase(), "users"),
    users: [],
    activeChatRoom: "",
    mouseOverChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
    }
  }

  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];

    onChildAdded(usersRef, (DataSnapshot) => {
      if (currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  };

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;

    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };

  /** 마우스 hover 이벤트 */
  mouseOverChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    this.setMouseOverChatRoom(user.uid);
  };

  setMouseOverChatRoom = (userId) => {
    this.setState({ mouseOverChatRoom: userId });
  };
  mouseoffChatRoom = () => {
    this.setState({ mouseOverChatRoom: "" });
  };

  renderDirectMessages = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        key={user.uid}
        style={{
          backgroundColor:
            (user.uid === this.state.activeChatRoom && "#ffffff45") ||
            (user.uid === this.state.mouseOverChatRoom && "#ffffff25") ||
            (this.state.mouseOverChatRoom === "" && "#2F3136"),
            width:220,
            height:45,
            paddingTop:5,
            paddingLeft:5,
            borderRadius: "5px"
        }}
        onClick={() => this.changeChatRoom(user)}
        onMouseOver={() => this.mouseOverChatRoom(user)}
        onMouseOut={() => this.mouseoffChatRoom()}
      >
        <img
          style={{ borderRadius: "100px", marginRight: 10 }}
          width={34}
          height={34}
          className="mr-3"
          src={
            user.image ||
            "data:image/jpeg;base64,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"
          }
          margin
        />
        {user.name}
      </li>
    ));

  render() {
    const { users } = this.state;

    return (
      <div>
        <span style={{ display: "flex", alignItems: "center",fontSize:'11px' }}>
          다이렉트 메시지
        </span>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages(users)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
