import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Space, Dropdown, message } from "antd";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import Upload from "./Upload";
import { toggleSideBar } from "../redux/sideBarSlice";

import { Input } from "antd";
import { Search } from "react-router-dom";
import { hostname } from "../util";
import { clearVideo } from "../redux/videoSlice";

export default function Navbar() {
  const [open, setopen] = useState(false);
  const [searchInput, setsearchInput] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { currUser } = useSelector((state) => state.user);
  let { isopen } = useSelector((state) => state.sideBar);
  const [q, setq] = useState("");

  const handleSideBar = (e) => {
    dispatch(toggleSideBar());
  };

  const items = [
    {
      label: "logut",
      key: "1",
      icon: <LogoutIcon />,
    },
  ];

  const menuProps = {
    items,
    onClick: async () => {
      dispatch(logout());
      dispatch(clearVideo());
      // localStorage.removeItem('persist:root')
      try {
        const res = await axios.post(`${hostname}/auth/logout`, null, {
          withCredentials: true,
        });
        message.success("logout sucsessfully.");
        navigate("/signin");
      } catch (error) {
        message.error("");
      }
    },
  };

  return (
    <>
      <div className="navbar">
        <div className="wrapper">
          <div
            style={{
              width: "75px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isopen ? (
              <div className="bar" onClick={handleSideBar}>
                <MenuIcon className="hambarger" />
              </div>
            ) : null}
          </div>
          <div className="search">
            <input
              onChange={(e) => setq(e.target.value)}
              type="text"
              name="search"
              id="search"
              placeholder="search heare.."
              value={q}
            />
            <div
              onClick={() => navigate(`/video/search?q=${q}`)}
              className="searchIcon"
            >
              <SearchIcon />
            </div>
          </div>

          {currUser ? (
            <div className="user">
              <VideoCallIcon
                style={{ cursor: "pointer" }}
                onClick={(e) => setopen(true)}
              />
              <Dropdown.Button
                menu={menuProps}
                placement="bottom"
                icon={
                  currUser.img ? (
                    <img
                      src={currUser.img}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <PersonIcon />
                  )
                }
              >
                {currUser.name}
              </Dropdown.Button>
            </div>
          ) : (
            <div className="signbtn">
              <Link
                to="/signin"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button type="primary" ghost icon={<AccountCircleIcon />}>
                  SIGN IN
                </Button>
              </Link>
            </div>
          )}

          {/* {(currUser || JSON.parse(localStorage.getItem("currUser"))) ? (
          <div className="user">
            <VideoCallIcon/>
          <Avatar
          style={{
            backgroundColor: "orange",
            verticalAlign: 'middle',
          }}
          size="large"
          gap={15}
        >
          {"u"}
        </Avatar>
        { currUser&& currUser.name}


          </div>
        ) : <div className="signbtn">
          <Link
            to="/signin"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button type="primary" ghost icon={ <AccountCircleIcon />}>
              SIGN IN
            </Button>
          </Link>

        </div>} */}
        </div>
      </div>
      {open ? <Upload setopen={setopen} /> : null}
    </>
  );
}
