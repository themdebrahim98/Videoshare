import React, { useState, useEffect } from "react";
import "./video.css";
import Card from "../components/Card";
import { Button, Space, Tooltip } from "antd";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFaliure,
  fetchStart,
  fetchSuccess,
  like,
  dislike,
} from "../redux/videoSlice";
import { format } from "timeago.js";
import { async } from "@firebase/util";
import { subscribe } from "../redux/userSlice";

export default function Video() {
  const [channel, setchannel] = useState({});
  const distpatch = useDispatch();
  let { currVideo } = useSelector((state) => state.video);
  let { currUser } = useSelector((state) => state.user);

  const path = useLocation().pathname.split("/")[2];
  console.log(path);

  const handleLike = async (e) => {
    const res = await axios.put(
      `http://localhost:8800/api/user/like/${path}`,
      null,
      {
        withCredentials: true,
      }
    );
    distpatch(like( currUser&& currUser._id));
    console.log(res.data);
  };

  const handleDislike = async (e) => {
    const res = await axios.put(
      `http://localhost:8800/api/user/dislike/${currVideo._id}`,
      null,
      {
        withCredentials: true,
      }
    );
    distpatch(dislike(currUser&& currUser._id));
    console.log(res.data);
  };

  const handleSubscribe = async (e) => {
    if (!currUser.subscribedUsers.includes(channel._id)) {
      let res = await axios.put(
        `http://localhost:8800/api/user/sub/${channel._id}`,
        null,
        {
          withCredentials: true,
        }
      );
      distpatch(subscribe(channel._id));
      console.log(res.data);
    } else {
      let res = await axios.put(
        `http://localhost:8800/api/user/unsub/${channel._id}`,
        null,
        {
          withCredentials: true,
        }
      );
      distpatch(subscribe(channel._id));
      console.log(res.data);
    }
  };

  useEffect(() => {
    try {
      const findVideo = async () => {
        distpatch(fetchStart());
        const videoRes = await axios.get(
          `http://localhost:8800/api/video/find/${path}`
        );
        const channelRes = await axios.get(
          `http://localhost:8800/api/user/find/${videoRes.data.userId}`
        );
        setchannel(channelRes.data);
        distpatch(fetchSuccess(videoRes.data));
      };
      findVideo();
    } catch (err) {
      console.log(err);
      distpatch(fetchFaliure());
    }
  }, [path, distpatch,currUser&& currUser.subscribedUsers]);

  return (
    <div className="video">
      <div className="videoWrapper">
        <video controls className="videoFrame"  src={currVideo?.videoUrl}>

        </video>
       
        <h1 className="title">{currVideo?.title}</h1>
        <div className="details">
          <div className="info">{`  ${currVideo?.views} views - ${format(
            currVideo && currVideo.createdAt
          )}`}</div>
          <div className="btngrp">
            <div className="btn" onClick={handleLike}>
              {currVideo?.likes?.includes(currUser&& currUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currVideo&& currVideo?.likes.length}
            </div>
            <div className="btn" onClick={handleDislike}>
              {currVideo&& currVideo.disLikes?.includes(currUser&& currUser._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownAltOutlinedIcon />
              )}
              Dislike
            </div>
            <div className="btn">
              <ReplyOutlined /> Share
            </div>
          </div>
        </div>
        <div className="channel">
          <div className="details">
            <img src={channel && channel.img} alt="" />

            <div className="info">
              <span className="channelTitle"> {`${channel.name} `}</span>

              <span className="channelCount">{`${channel.subscribers} Subscribes`}</span>
            </div>
          </div>

          <div className="subscribebutton">
            <Button
              type="primary"
              size="large"
              onClick={handleSubscribe}
              style={{ backgroundColor: "red" }}
            >
              {!(currUser && currUser.subscribedUsers.includes(channel._id))
                ? "SUBSCRIBE"
                : "SUBSCRIBED"}
            </Button>
          </div>
        </div>
        <p className="channelDescription">{currVideo&& currVideo.desc}</p>
        <Comments  videoId = {currVideo&& currVideo._id}/>
      </div>
      <div className="recommendedWrapper">
        <h1 style={{ margin: "5px 5px" }}>Recommended</h1>

        {/* <Card /> e   
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card /> */}
      </div>
    </div>
  );
}
