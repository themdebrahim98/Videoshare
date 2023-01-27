import React, { useState, useEffect, useRef } from "react";
import { Input, Avatar, Button } from "antd";
import "./comments.css";
import Comment from "./Comment";
import axios from "axios";
import { async } from "@firebase/util";
import { useSelector } from "react-redux";
import {hostname} from '../util.js'
export default function Comments({ videoId }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState({});
  const inputRef = useRef();
  let { currUser } = useSelector((state) => state.user);

  const sortComment = (comments) => {
    comments.sort((a, b) => b.createdAt - a.createdAt);
  };
  const handleComment = (e) => {
    setcomment({ ...comment, desc: e.target.value });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${hostname}/comment`,
        {
          desc: comment.desc,
          videoId,
        },
        { withCredentials: true }
      );

      inputRef.current.value = "";
      const getComments = async () => {
        const res = await axios.get(
          `${hostname}/comment/${videoId}`
        );

        setcomments(res.data);
      };
      getComments();
    } catch (error) {
      alert("You are not authorized!, please sign in to like, comment ");
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(
        `${hostname}/comment/${videoId}`
      );

      setcomments(res.data);
    };
    getComments();
  }, [videoId]);

  return (
    <div className="comments">
      <div className="newComment">
        <div className="avatar">
          <img src={currUser && currUser.img} alt="" />
        </div>
        <input
          ref={inputRef}
          onChange={handleComment}
          type="text"
          name="comment"
          placeholder="Type comment..."
        />
        <Button type="primary" onClick={handleSubmitComment}>
          comment
        </Button>
      </div>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}
