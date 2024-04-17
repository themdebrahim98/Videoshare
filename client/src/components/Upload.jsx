import { Button, message } from "antd";
import React, { useState, useEffect } from "react";
import "./upload.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase.js";
import axios from "axios";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { Input, Space } from "antd";
import { hostname } from "../util";
const { Search } = Input;
const { TextArea } = Input;
export default function Upload({ setopen: setOpen }) {
  const [video, setVideo] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState(undefined);
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [imagePercentage, setImagePercentage] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    try {
      const res = await axios.post(
        `${hostname}/video`,
        { ...inputs, tags: tags },
        { withCredentials: true }
      );
      navigate("/video/trend");
      message.success("Video uploaded sucsessfully");
      setOpen(false);
    } catch (error) {
      message.error("Video not uploaded!");
    }
  };

  const videoHandle = (e) => {
    try {
      video && uploadFile(video, "videoUrl");
      // message.success("video  uploaded succsessfully")
    } catch (error) {}
  };

  const thumbnailHandle = (e) => {
    try {
      image && uploadFile(image, "imgUrl");
      // message.success("Thumbanail uploaded succsessfully")
    } catch (error) {}
  };
  // useEffect(() => {
  //   video && uploadFile(video, "videoUrl");
  // }, [video]);
  // useEffect(() => {
  //   image && uploadFile(image, "imgUrl");
  // }, [image]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadFile = async (file, typeUrl) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        typeUrl == "videoUrl"
          ? setVideoPercentage(progress)
          : setImagePercentage(progress);
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          message.success(
            `${
              typeUrl != "imgUrl" ? "Video" : "Thumbanail"
            } uploaded succsessfully`
          );
          setInputs((prev) => ({ ...prev, [typeUrl]: downloadURL }));
        });
      }
    );
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  return (
    <div className="upload">
      <div className="uploadWrapper">
        <div className="close" onClick={() => setOpen(false)}>
          X
        </div>
        <h1 className="title">Upload new video</h1>
        <label htmlFor="video">Video: </label>
        {videoPercentage > 0 ? (
          <Progress percent={videoPercentage} />
        ) : (
          <div className="input">
            <Search
              style={{ width: "100%" }}
              onChange={(e) => setVideo(e.target.files[0])}
              type="file"
              name="video"
              id="video"
              accept="video/*"
              size="large"
              enterButton="Upload"
              placeholder="input search text"
              onSearch={videoHandle}
            />
            {/* <input
              onChange={(e) => setVideo(e.target.files[0])}
              type="file"
              name="video"
              id="video"
              accept="video/*"
            />
            <Button ghost>upload</Button> */}
          </div>
        )}

        <label htmlFor="title">Title</label>
        <Input
          onChange={handleChange}
          type="text"
          placeholder="title"
          name="title"
        />
        <label htmlFor="desc">Description: </label>
        <TextArea
          onChange={handleChange}
          name="desc"
          placeholder="Description"
        />

        <label htmlFor="tags">Tags: </label>
        <Input
          onChange={handleTags}
          type="text"
          placeholder="seperate tag with comma"
          name="tags"
        />

        <label htmlFor="thumbanail">Thumbanail: </label>

        {imagePercentage > 0 ? (
          <Progress percent={imagePercentage} />
        ) : (
          <>
            <Search
              style={{ width: "100%" }}
              onChange={(e) => setImage(e.target.files[0])}
              id="thumbanail"
              accept="image/*"
              name="img"
              type="file"
              size="large"
              enterButton="upload"
              placeholder="input search text"
              onSearch={thumbnailHandle}
            />

            {/* <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="thumbanail"
              accept="image/*"
              name="img"
            /> */}
          </>
        )}

        <Button type="primary" onClick={handleUpload}>
          {" "}
          Submit
        </Button>
      </div>
    </div>
  );
}
