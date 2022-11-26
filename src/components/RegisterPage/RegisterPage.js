import React, { useRef, useState } from "react";
import { Await, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; //유효성 검사
import { async } from "@firebase/util";
import firebase from "../../firebase";
import md5 from "md5"; //유니크한 값 생성
function RegisterPage() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [errorFromSubmit, seterrorFromSubmit] = useState(""); //에러 메시지 출력위해

  const [loading, setLoading] = useState(false); //submit 버튼 클릭시 유저 생성중(이때 버튼 클릭 막기)

  const password = useRef();
  password.current = watch("password");

  const onSubmit = async (data) => {
    // 파이어베이스에 이메일과 아이디를 만들어준다 . 비동기 처리해줌
    try {
      setLoading(true);
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      await createdUser.user.updateProfile({
        //updateProfile은 파이어베이스에서 제공함
        displayName: data.name,
        photoURL: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRuhc40Kq8ycwjqiTURoS2i9JYIIPuf1JaNg&usqp=CAU`,
      });

      //firebase 데이터베이스에 저장해주기(.ref("users")<- users라는 테이블이름,콜렉션이름임)
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        Image: createdUser.user.photoURL,
      });
      setLoading(false);
    } catch (error) {
      seterrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        seterrorFromSubmit("");
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          style={{ textAlign: "center", color: "white", marginBottom: "30px" }}
        >
          <h3>계정 만들기</h3>
        </label>

        <label>이메일</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          //ref = {register({ required:true , maxLength : 10 })}
        />
        {errors.email && <p>This email field is required</p>}

        <label>사용자명</label>
        <input
          name="name"
          type="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This name field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your input exceed maximum length</p>
        )}

        <label>비밀번호</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>This password must have at least 6ch</p>
        )}

        <label>비밀번호 확인</label>
        <input
          name="password_confirm"
          type="password"
          {...register("password_confirm", {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.password_confirm &&
          errors.password_confirm.type === "required" && (
            <p>this password confirm field is required</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === "validate" && (
            <p>the passwords do not match</p>
          )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" disabled={loading} value="계속하기" />

        <Link style={{ color: "#4FADF0", textDecoration: "none" }} to="/login">
          이미 계정이 있으신가요?
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
