import logo from "./logo.svg";
import "./App.css";

import { Routes, Route, Link, useNavigate } from "react-router-dom";

import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";

import { useDispatch, useSelector } from "react-redux"; //리덕스로 로그인 유저 관리
import { setUser, clearUser } from "./redux/actions/user_action";

function App(props) {
  //let history = useHistory(); //히스토리 객체가 없어서 useHistory로 만들어준다
  const navigate = useNavigate();

  let dispatch = useDispatch();

  const isLoading = useSelector((state) => state.user.isLoading);
  //리덕스 통해서 가져오기

  useEffect(() => {
    //인증된 사람은 로그인페이지 X, 채팅페이지로 이동
    //유저의 상태를 지켜본다.(옵저버)
    firebase.auth().onAuthStateChanged((user) => {
      //유저가 있으면 == 로그인이 된 상태
      if (user) {
        //history.push("/"); //채팅 페이지로 보내준다
        navigate("/");
        dispatch(setUser(user)); //로그인된 정보 redux통해서 뿌리기
      }
      //유저가 없으면 로그인이 되지 않은 상태
      else {
        //history.push("/login");
        navigate("/login");
        dispatch(clearUser(user));
      }
    });
  }, []);

  if (isLoading) {
    return <div>...loading</div>;
  } else {
    return (
      <Routes>
        <Route exact path="/" element={<ChatPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
}

export default App;
