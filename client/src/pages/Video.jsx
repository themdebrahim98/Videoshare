import React, { useState, useEffect } from "react";
import "./video.css";
import Card from "../components/Card";
import { Button, Space, Tooltip, Alert, message } from "antd";
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
import Reccommendation from "../components/Reccommendation";
import { hostname } from "../util";

export default function Video() {
  const [messageApi, contextHolder] = message.useMessage();
  const [channel, setchannel] = useState({});
  const distpatch = useDispatch();
  let { currVideo } = useSelector((state) => state.video);
  let { currUser } = useSelector((state) => state.user);

  const path = useLocation().pathname.split("/")[2];

  const warning = () => {
    message.error("You are not authorized!");
  };

  const handleLike = async (e) => {
    try {
      const res = await axios.put(`${hostname}/user/like/${path}`, null, {
        withCredentials: true,
      });
      distpatch(like(currUser && currUser._id));
    } catch (error) {
      message.warning(
        "You are not authorized!, please sign in to like, comment "
      );
    }
  };

  const handleDislike = async (e) => {
    try {
      const res = await axios.put(
        `${hostname}/user/dislike/${currVideo._id}`,
        null,
        {
          withCredentials: true,
        }
      );
      distpatch(dislike(currUser && currUser._id));
    } catch (error) {
      message.warning(
        "You are not authorized!, please sign in to like, comment "
      );
    }
  };

  const handleSubscribe = async (e) => {
    try {
      if (!currUser.subscribedUsers.includes(channel._id)) {
        let res = await axios.put(`${hostname}/user/sub/${channel._id}`, null, {
          withCredentials: true,
        });
        distpatch(subscribe(channel._id));
      } else {
        let res = await axios.put(
          `${hostname}/user/unsub/${channel._id}`,
          null,
          {
            withCredentials: true,
          }
        );
        distpatch(subscribe(channel._id));
      }
    } catch (error) {
      message.warning(
        "You are not authorized!, please sign in to like, comment "
      );
    }
  };

  useEffect(() => {
    try {
      const findVideo = async () => {
        distpatch(fetchStart());

        if (currUser) {
          await axios.put(`${hostname}/video/view/${path}`, null, {
            withCredentials: true,
          });
        }

        const videoRes = await axios.get(`${hostname}/video/find/${path}`);
        const channelRes = await axios.get(
          `${hostname}/user/find/${videoRes.data.userId}`
        );
        setchannel(channelRes.data);
        distpatch(fetchSuccess(videoRes.data));
      };
      findVideo();
    } catch (err) {
      distpatch(fetchFaliure());
    }
  }, [path, distpatch, currUser && currUser.subscribedUsers]);

  return (
    <div className="video">
      <div className="videoWrapper">
        <video
          controls
          className="videoFrame"
          src={currVideo?.videoUrl}
        ></video>

        <h1 className="title">{currVideo?.title}</h1>
        <div className="details">
          <div className="info">{`  ${
           currVideo && currVideo?.viedeoViewUsers.length
          } views - ${format(currVideo && currVideo.createdAt)}`}</div>
          <div className="btngrp">
            <div className="btn" onClick={handleLike}>
              {currVideo?.likes?.includes(currUser && currUser._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currVideo && currVideo?.likes.length}
            </div>
            <div className="btn" onClick={handleDislike}>
              {currVideo &&
              currVideo.disLikes?.includes(currUser && currUser._id) ? (
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

              <span className="channelCount">{`${channel.subscribers} Subscribers`}</span>
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
        <p className="channelDescription">{currVideo && currVideo.desc}</p>
        <Comments videoId={currVideo && currVideo._id} />
      </div>
      <div className="recommendedWrapper">
        <h1 style={{ margin: "5px 5px" }}>Recommended</h1>

        <Reccommendation tags={currVideo && currVideo.tags} />
        {/* <Card /> e   
        // <Card />
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
