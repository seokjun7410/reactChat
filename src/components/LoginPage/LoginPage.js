import React, { useState } from "react";
import { Await, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { async } from "@firebase/util";
import firebase from "../../firebase";
function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [errorFromSubmit, seterrorFromSubmit] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // 파이어베이스에 이메일과 아이디를 만들어준다 . 비동기 처리해줌
    try {
      setLoading(true);

      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);

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
        <label style={{ textAlign: "center", color: "white" }}>
          <h3>돌아오신 것을 환영해요!</h3>
        </label>
        <label
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "20px",
          }}
        >
          다시 만나다니 너무 반가워요!
        </label>

        <label>이메일</label>

        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This email field is required</p>}

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

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" value="로그인" disabled={loading} />
        <label style={{ display: "inline" }}>계정이 필요하신가요? </label>

        <Link
          style={{ color: "#4FADF0", textDecoration: "none" }}
          to="/register"
        >
          가입하기
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
