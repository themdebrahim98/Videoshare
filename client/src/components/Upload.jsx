import { Button } from "antd";
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


export default function Upload({ setopen }) {
  const [video, setvideo] = useState(undefined);
  const [image, setimage] = useState(undefined);
  const [inputs, setinputs] = useState({});
  const [tags, settags] = useState(undefined);
  const [videoPercentege, setvideoPercentege] = useState(0);
  const [imagePercetage, setimagePercetage] = useState(0);
  const navigate = useNavigate()
  const handleUpload = async (e) => {
      video &&  uploadFile(video, "videoUrl");
      image &&  uploadFile(image, "imgUrl");
    const res = await axios.post(
      "http://localhost:8800/api/video",
      { ...inputs, tags: tags },
      { withCredentials: true }
    );
    console.log("uploaded new video");
    navigate("/trend")
    setopen(false)
  };

  const handleChange = (e) => {
    setinputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadFile = (file, typeUrl) => {
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
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setinputs((prev) => ({ ...prev, [typeUrl]: downloadURL }));
        });
      }
    );
  };

  const handleTags = (e) => {
    settags(e.target.value.split(","));
  };

  // useEffect(() => {
  //   video && uploadFile(video, "videoUrl");
  // }, [video]);

  // useEffect(() => {
  //   image && uploadFile(image, "imgUrl");
  // }, [image]);

  return (
    <div className="upload">
      {console.log(videoPercentege)}
      <div className="uploadWrapper">
        <div className="close" onClick={() => setopen(false)}>
          X
        </div>
        <h1 className="title">Upload new video</h1>
        <label htmlFor="video">Video: </label>
       
        {videoPercentege > 0 ? (
           <Progress percent={videoPercentege} />

        ) : (
          <input
            onChange={(e) => setvideo(e.target.files[0])}
            type="file"
            name="video"
            id="video"
            accept="video/*"
          />
        )}

        <input
          onChange={handleChange}
          type="text"
          placeholder="title"
          name="title"
        />
        <textarea
          onChange={handleChange}
          name="desc"
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <input
          onChange={handleTags}
          type="text"
          placeholder="seperate tag with comma"
          name="tags"
        />

        <label htmlFor="thumbanail">Thumbanail: </label>

        {imagePercetage > 0 ? (
          <Progress percent={imagePercetage} />
        ) : (
          <input
            onChange={(e) => setimage(e.target.files[0])}
            type="file"
            id="thumbanail"
            accept="image/*"
            name="img"
          />
        )}

        <Button type="primary" onClick={handleUpload}>
          {" "}
          Upload
        </Button>
      </div>
    </div>
  );
}
