import React, { useState, useEffect } from "react";
import "./card.css";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";
import blankImg from '../images/blank.jpg'





export default function Card({ video }) {
  const [user, setuser] = useState("");
  let { currVideo } = useSelector((state) => state.video);


  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`http://localhost:8800/api/user/find/${video.userId}`);
      console.log(res.data, "data");
      setuser(res.data);
    };
    getUser();
  }, [video.userId]);
  return (
    <div className="card">
      <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
        <div className="wrapper">
          <img
          style={{objectFit:'cover'}}
            src={video.imgUrl == "" ? blankImg:video.imgUrl }
            alt=""
          />
          <div className="details">
            <img src={user.img} alt="" />
            <div className="texts">
              <h1>{video.desc}</h1>
              <h2>{user.name}</h2>
              <div className="info">{`${video.views} views - ${format(
                video.createdAt
              )} `}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
