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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginInputData, setLoginInputData] = useState({
    password: null,
    email: null,
  });
  const [signUpInputData, setSignUpInputData] = useState({
    password: null,
    email: null,
    name: null,
  });

  const loginWithGoogle = async (e) => {
    dispatch(loginStart());
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

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

        console.log(res);
        await dispatch(loginSuccess(res.data));
        navigate("/");
      } catch (error) {
        console.error("Error while sending data to server:", error);
        message.warning("Error while sending data to server");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      message.warning("Error signing in with Google");
      dispatch(loginFaliure());
    }
  };

  const handleChange = (e) => {
    setLoginInputData({ ...loginInputData, [e.target.name]: e.target.value });
  };

  const handleSignUpData = (e) => {
    setSignUpInputData({
      ...signUpInputData,
      [e.target.name]: e.target.value,
    });
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${hostname}/auth/signup`, signUpInputData, {
        withCredentials: true,
      });
      setSignUpInputData({
        name: null,
        email: null,
        password: null,
      });
      message.success(res.data.message);
    } catch (error) {
      message.error(error?.response.data.message);
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    try {
      dispatch(loginStart());
      const res = await axios.post(`${hostname}/auth/signin`, loginInputData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(loginSuccess(res.data));
        message.success("Logged in successfully");
        navigate("/");
      }
    } catch (error) {
      // Handle network errors or server errors
      dispatch(loginFaliure());
      if (error.response) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="signin">
      <div className="signinWrapper">
        <h1 className="title">Sign In</h1>

        <input
          onChange={handleChange}
          type="text"
          name="email"
          id="name"
          placeholder="email"
        />
        <input
          onChange={handleChange}
          placeholder="password"
          type="password"
          name="password"
          id="password"
        />
        <button className="btn" onClick={handleLogin}>
          sign in
        </button>
        <div className="googlebtn">
          <Button type="primary" icon={<FcGoogle />} onClick={loginWithGoogle}>
            login with google
          </Button>
        </div>

        <h1 style={{ margin: "8px" }}>or</h1>
        <input
          onChange={handleSignUpData}
          value={signUpInputData.name}
          placeholder="name"
          type="text"
          name="name"
          id=""
        />
        <input
          onChange={handleSignUpData}
          value={signUpInputData.email}
          placeholder="email"
          type="email"
          name="email"
          id=""
          required
        />
        <input
          onChange={handleSignUpData}
          value={signUpInputData.password}
          placeholder="password"
          type="password"
          name="password"
          id=""
        />

        <button onClick={signUp} className="btn">
          sign up
        </button>
      </div>
    </div>
  );
}
