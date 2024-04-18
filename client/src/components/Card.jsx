import React, { useState, useEffect } from "react";
import "./card.css";
import { Link, Navigate } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";
import blankImg from "../images/blank.jpg";
import blankUSer from "../images/blankuser.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { hostname } from "../util.js";

export default function Card({ video, videos, setvideos }) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Are Yyou sure want to delete this video!"
  );
  const [user, setuser] = useState("");
  let { currVideo } = useSelector((state) => state.video);
  let { currUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    const res = await axios.delete(`${hostname}/video/${video._id}`, {
      withCredentials: true,
    });
    message.success("Video deleted Successfully, Please refresh this page");

    if (res.data) {
      setOpen(false);
      setConfirmLoading(false);
    }
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.get(`${hostname}/user/find/${video.userId}`);
      setuser(res.data);
    };
    getUser();
  }, [video.userId]);
  return (
    <div className="card">
      {currUser && currUser._id == video.userId ? (
        <div>
          <MoreVertIcon onClick={showModal} className="bar" />
          <Modal
            title="Title"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <p>{modalText}</p>
          </Modal>
        </div>
      ) : null}

      <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
        <div className="wrapper">
          <img
            style={{ objectFit: "cover" }}
            src={video.imgUrl == "" ? blankImg : video.imgUrl}
            alt=""
          />
          <div className="details">
            <img src={user && (user.img == "" ? blankUSer : user.img)} alt="" />
            <div className="texts">
              <h1 style={{ margin: "0" }}>{video.title}</h1>
              <h2>{user && user.name}</h2>
              <div className="info">{`${
                video.viedeoViewUsers.length
              } views - ${format(video.createdAt)} `}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
