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

  const loginWithgoogle = async (e) => {
    dispatch(loginStart());
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        try {
          console.log(result, "reslt");
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
          console.log(error);
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
      message.success("Sign up succsessfully");
      setSignUpInputData({
        name: null,
        email: null,
        password: null,
      });
    } catch (e) {
      message.warning("please enter correct data ");
      console.log(e);
    }
  };

  const handleLogin = async (e) => {
    try {
      dispatch(loginStart());
      const res = await axios.post(`${hostname}/auth/signin`, loginInputData, {
        withCredentials: true,
      });
      dispatch(loginSuccess(res.data));
      message.success("login succsessfully ");

      navigate("/");
    } catch (e) {
      dispatch(loginFaliure());
      message.warning(" Please enter correct username and password! ");
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
          placeholder="password"
          type="password"
          name="password"
          id="password"
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
