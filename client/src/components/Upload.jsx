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
export default function Upload({ setopen }) {
  const [video, setvideo] = useState(undefined);
  const [image, setimage] = useState(undefined);
  const [inputs, setinputs] = useState({});
  const [tags, settags] = useState(undefined);
  const [videoPercentege, setvideoPercentege] = useState(0);
  const [imagePercetage, setimagePercetage] = useState(0);
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
      setopen(false);
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
  const thumbanailHandle = (e) => {
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
    setinputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          ? setvideoPercentege(progress)
          : setimagePercetage(progress);
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
          setinputs((prev) => ({ ...prev, [typeUrl]: downloadURL }));
        });
      }
    );
  };

  const handleTags = (e) => {
    settags(e.target.value.split(","));
  };

  

  return (
    <div className="upload">
      <div className="uploadWrapper">
        <div className="close" onClick={() => setopen(false)}>
          X
        </div>
        <h1 className="title">Upload new video</h1>
        <label htmlFor="video">Video: </label>

        {videoPercentege > 0 ? (
          <Progress percent={videoPercentege} />
        ) : (
          <div className="input">
            <Search
              style={{ width: "100%" }}
              onChange={(e) => setvideo(e.target.files[0])}
              type="file"
              name="video"
              id="video"
              accept="video/*"
              size="large"
              enterButton="upload"
              placeholder="input search text"
              onSearch={videoHandle}
            />
            {/* <input
              onChange={(e) => setvideo(e.target.files[0])}
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

        {imagePercetage > 0 ? (
          <Progress percent={imagePercetage} />
        ) : (
          <>
            <Search
              style={{ width: "100%" }}
              onChange={(e) => setimage(e.target.files[0])}
              id="thumbanail"
              accept="image/*"
              name="img"
              type="file"
              size="large"
              enterButton="upload"
              placeholder="input search text"
              onSearch={thumbanailHandle}
            />

            {/* <input
              onChange={(e) => setimage(e.target.files[0])}
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
