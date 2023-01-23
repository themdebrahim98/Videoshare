import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import {message} from'antd'
export default function Home({ type }) {
  const [videos, setvideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/video/${type}`, {
          withCredentials: true,
        });
        setvideos(res.data);
        
      } catch (err) {
        message.warning("You are not authorized!, please sign in to like, comment ");
        setvideos([])
      }
    };

    getVideos();


  }, [type]);

  return (
    <>
      {videos.length > 0
        ? videos.map((video) => (
            <Card
              key={video._id}
              video={video}
              videos={videos}
              setvideos={setvideos}
            />
          ))
        : null}
    </>
  );
}
