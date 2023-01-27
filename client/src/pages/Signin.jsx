import React, { useState } from "react";
import "./signin.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFaliure, loginStart, loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase";
import { Button, Space, message } from "antd";
import { FcGoogle } from "react-icons/fc";
import { hostname } from "../util";

export default function Signin() {
  const [loginInputDatas, setloginInputDatas] = useState({
    passward: null,
    email: null,
  });
  const [signUpInputDatas, setsignUpInputDatas] = useState({
    passward: "",
    email: '',
    name: '',
  });

  const loginWithgoogle = async (e) => {
    dispatch(loginStart());
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        try {
          const res = await axios.post(
            `${hostname}/auth/google`,
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
            {
              withCredentials: true,
            }
          );
          dispatch(loginSuccess(res.data));

          navigate("/");
        } catch (error) {
          message.warning(
            "You are not authorized!, please sign in to like, comment "
          );
        }

        // ...
      })
      .catch((error) => {
        dispatch(loginFaliure());
      });
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setloginInputDatas({ ...loginInputDatas, [e.target.name]: e.target.value });
  };

  const handleSignUpDatas = (e) => {
    setsignUpInputDatas({
      ...signUpInputDatas,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${hostname}/auth/signup`,
        signUpInputDatas,
        {
          withCredentials: true,
        }
      );
      message.success("Sign up succsessfully");
      setsignUpInputDatas({
        name: null,
        email: null,
        passward: null,
      });
    } catch (e) {
      message.warning("please enter correct data ");
    }
  };
  const handleLogin = async (e) => {
    try {
      dispatch(loginStart());
      const res = await axios.post(
        `${hostname}/auth/signin`,
        loginInputDatas,
        {
          withCredentials: true,
        }
      );
      dispatch(loginSuccess(res.data));
      message.success("login succsessfully ");

      navigate("/");
    } catch (e) {
      dispatch(loginFaliure());
      message.warning(" Please enter correct username and passward! ");
    }
  };

  return (
    <div className="signin">
      <div className="signinWrapper">
        <h1 className="title">Sign In</h1>
        <h2 className="subtitle">to continue to Md Dev</h2>
        <input
          onChange={handleChange}
          type="text"
          name="email"
          id="name"
          placeholder="email"
        />
        <input
          onChange={handleChange}
          placeholder="passward"
          type="passward"
          name="passward"
          id="passward"
        />
        <button className="btn" onClick={handleLogin}>
          sign in
        </button>
        <div className="googlebtn">
          <Button type="primary" icon={<FcGoogle />} onClick={loginWithgoogle}>
            login with google
          </Button>
        </div>

        <h1 style={{ margin: "8px" }}>or</h1>
        <input
          onChange={handleSignUpDatas}
          value={signUpInputDatas.name}
          placeholder="name"
          type="text"
          name="name"
          id=""
        />
        <input
          onChange={handleSignUpDatas}
          value={signUpInputDatas.email}
          placeholder="email"
          type="email"
          name="email"
          id=""
        />
        <input
          onChange={handleSignUpDatas}
          value={signUpInputDatas.passward}
          placeholder="passward"
          type="passward"
          name="passward"
          id=""
        />

        <button onClick={handleSignUp} className="btn">
          sign up
        </button>
      </div>
    </div>
  );
}
