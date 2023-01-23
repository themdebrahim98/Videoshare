import React, { useState, useEffect, useRef } from "react";
import { Input, Avatar, Button } from "antd";
import "./comments.css";
import Comment from "./Comment";
import axios from "axios";
import { async } from "@firebase/util";

export default function Comments({ videoId }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState({});
  const inputRef = useRef();

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
        "http://localhost:8800/api/comment",
        {
          desc: comment.desc,
          videoId,
        },
        { withCredentials: true }
      );

      console.log(res, "comment");
      inputRef.current.value = "";
      const getComments = async () => {
        const res = await axios.get(
          `http://localhost:8800/api/comment/${videoId}`
        );

        setcomments(res.data);
        console.log(res.data);
      };
      getComments();
    } catch (error) {
      alert("You are not authorized!, please sign in to like, comment ");
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/comment/${videoId}`
      );

      setcomments(res.data);
      console.log(res.data);
    };
    getComments();
  }, [videoId]);

  return (
    <div className="comments">
      <div className="newComment">
        <div className="avatar">
          <img src={"j"} alt="" />
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
