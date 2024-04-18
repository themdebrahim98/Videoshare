import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import { message, Col, Row } from "antd";
import { useSelector } from "react-redux";
import { hostname } from "../util.js";

export default function Home({ type }) {
  const [videos, setvideos] = useState([]);
  const { isopen } = useSelector((state) => state.sideBar);

  const sort = (datas) => {
    let sorVideos = datas.sort(
      (a, b) => b.viedeoViewUsers.length - a.viedeoViewUsers.length
    );
    return sorVideos;
  };

  // let hostUrl = `${window.location.origin}/api/video/${type}`;
  // let testUrl = `http://localhost:8800/api/video/${type}`
  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axios.get(`${hostname}/video/${type}`, {
          withCredentials: true,
        });
        if (type == "trend") {
          setvideos(sort(res.data));
        }
        setvideos(res.data);
      } catch (err) {
        message.warning(
          "You are not authorized!, please sign in to like, comment "
        );
        setvideos([]);
      }
    };

    getVideos();
  }, [type]);

  return (
    <Row gutter={8}>
      {videos.length > 0 ? (
        videos.map((video, idx) => (
          <Col
            key={idx}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 6 }}
          >
            <Card
              key={idx}
              video={video}
              videos={videos}
              setvideos={setvideos}
            />
          </Col>
        ))
      ) : (
        <div>
          <h2>No Videos Available</h2>
          <p>There are currently no videos available. Check back later!</p>
        </div>
      )}
    </Row>
  );
}
