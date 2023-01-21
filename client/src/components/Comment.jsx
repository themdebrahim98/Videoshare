import React,{useState, useEffect} from "react";
import {format} from 'timeago.js'
import "./comment.css";
import axios from "axios";

export default function Comment({comment}) {
  const [channel, setchannel] = useState({});

  useEffect(() => {
    try {
      const fetchComments = async () => {
        const res = await axios.get(
          `http://localhost:8800/api/user/find/${comment.userId}`
        );
        setchannel(res.data)
       
      };
      fetchComments();
    } catch (err) {
      console.log(err);
     
    }
  }, [comment.userId]);


  return (
    <div className="comment">
      <div className="commentWrapper">
        <div className="avatar">
          <img
            src="https://i.picsum.photos/id/569/200/200.jpg?hmac=rzX0dRJRyZs2NIa_h_87CJVeoetRLtTlweCZmYrYlCA"
            alt="logo"
          />
        </div>
        <div className="details">
          <div className="title">
            {channel.name} <span style={{color:"gray",fontWeight:"400"}}>{format(comment.createdAt)}</span>
          </div>
          <div className="description">
           {comment.desc}
          </div>
        </div>
      </div>
    </div>
  );
}
