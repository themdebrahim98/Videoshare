import React, { useState, useEffect } from "react";
import "./search.css";
import axios from "axios";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { message, Row, Col } from "antd";
import { hostname } from "../util";
export default function Search() {
  const [searchVideos, setsearchVideos] = useState([]);
  const path = useLocation().search;
  useEffect(() => {
    try {
      const searchVideo = async () => {
        const res = await axios.get(
          `${hostname}/video/search${path}`
        );
        setsearchVideos(res.data);
      };
      searchVideo();
    } catch (error) {
      message.error("something wrong");
    }
  }, [path]);

  return (
    <Row className="searchPage">
      {searchVideos.map((video) => (
        <Col
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
        >
          <Card key={video._id} video={video} />
        </Col>
      ))}
    </Row>
  );
}
