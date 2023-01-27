import React, { useState, useEffect } from "react";
import { format } from "timeago.js";
import "./comment.css";
import axios from "axios";
import {hostname} from '../util.js'
export default function Comment({ comment }) {
  const [channel, setchannel] = useState({});

  useEffect(() => {
    try {
      const fetchComments = async () => {
        const res = await axios.get(
          `${hostname}/user/find/${comment.userId}`
        );
        setchannel(res.data);
      };
      fetchComments();
    } catch (err) {}
  }, [comment.userId]);

  return (
    <div className="comment">
      <div className="commentWrapper">
        <div className="avatar">
          <img src={channel && channel.img} alt="logo" />
        </div>
        <div className="details">
          <div className="title">
            {channel.name}{" "}
            <span style={{ color: "gray", fontWeight: "400" }}>
              {format(comment.createdAt)}
            </span>
          </div>
          <div className="description">{comment.desc}</div>
        </div>
      </div>
    </div>
  );
}
