import React, { useState } from "react";
import "./signin.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFaliure, loginStart, loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase";
import { Button, Space , message} from "antd";
import { FcGoogle } from "react-icons/fc";

export default function Signin() {
  const [loginInputDatas, setloginInputDatas] = useState({
    passward: null,
    email: null,
  });
  const [signUpInputDatas, setsignUpInputDatas] = useState({
    passward: null,
    email: null,
    name:null
  });

  const loginWithgoogle = async (e) => {
    dispatch(loginStart());
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result, "resultt");
        try {
          const res = await axios.post("http://localhost:8800/api/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          },
          {
            withCredentials:true
          });
          dispatch(loginSuccess(res.data));
  
          console.log(res, "data");
          navigate("/");
          
        } catch (error) {
          message.warning("You are not authorized!, please sign in to like, comment ");

        }

        // ...
      })
      .catch((error) => {
        dispatch(loginFaliure());
        console.log(error);
      });
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setloginInputDatas({ ...loginInputDatas, [e.target.name]: e.target.value });
  };

  const handleSignUpDatas =(e) => {
    setsignUpInputDatas({...signUpInputDatas, [e.target.name] : e.target.value})
  }

  const handleSignUp = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/signup",
        signUpInputDatas,
        {
          withCredentials: true,
        }
      );
      message.success("Sign up succsessfully");
      setsignUpInputDatas({
        name:null,
        email:null,
        passward:null

      })
      console.log(res.data);
      console.log(document.cookie, "cookie");
    } catch (e) {
      message.warning("please enter correct data ");

      console.log(e);
    }


    }
  const handleLogin = async (e) => {
    try {
      dispatch(loginStart());
      const res = await axios.post(
        "http://localhost:8800/api/auth/signin",
        loginInputDatas,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      dispatch(loginSuccess(res.data));
      console.log(document.cookie, "cookie");
      message.success("login succsessfully ");

      navigate("/");
    } catch (e) {
      console.log(e);
      dispatch(loginFaliure());
      message.warning(" Please enter correct username and passward! ");

    }
  };

  return (
    <div className="signin">
      {console.log(loginInputDatas)}
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
          <Button
            type="primary"
            icon={<FcGoogle />}
            onClick={loginWithgoogle}
          >
            login with google
          </Button>
        </div>

        <h1 style={{ margin: "8px" }}>or</h1>
        <input onChange={handleSignUpDatas} value={signUpInputDatas.name} placeholder="name" type="text" name="name" id="" />
        <input onChange={handleSignUpDatas} value={signUpInputDatas.email} placeholder="email" type="email" name="email" id="" />
        <input onChange={handleSignUpDatas} value={signUpInputDatas.passward} placeholder="passward" type="passward" name="passward" id="" />

        <button onClick={handleSignUp} className="btn">sign up</button>
      </div>
    </div>
  );
}
