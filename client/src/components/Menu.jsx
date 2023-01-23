import React from "react";
import logo from "../images/logo.svg";
import "./menu.css";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import SettingsIcon from "@mui/icons-material/Settings";
import NightlightIcon from "@mui/icons-material/Nightlight";
import HistoryIcon from "@mui/icons-material/History";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Button, Space } from "antd";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useContext } from "react";
import { ThemeContext } from "../App.js";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {GrChannel} from 'react-icons/gr'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';



export default function Menu() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  console.log(theme, "klnkl");
  return (
    <div className={theme == "dark" ? "menu" : "menu lightTheme"}>
      <div className="wrapper">
        <Link
          to="/"
          style={{ color: "inherit", textDecoration: "none" }}
          color="inherit"
        >
          <div className="logo">
            <img src={logo} width="40px" height="50px" alt="" />
            MD YOUTUBE
          </div>
        </Link>

        <Link
          to="/"
          style={{ color: "inherit", textDecoration: "none" }}
          color="inherit"
        >
          <div className="item">
            <HomeIcon />
            Home
          </div>
        </Link>

        <Link
          to="video/trend"
          style={{ color: "inherit", textDecoration: "none" }}
          color="inherit"
        >
          <div className="item">
            <ExploreIcon />
            Trend
          </div>
        </Link>

        <Link
          to="/video/sub"
          style={{ color: "inherit", textDecoration: "none" }}
          color="inherit"
        >
          <div className="item">
            <SubscriptionsIcon />
            Subscription
          </div>
        </Link>

        <Link
          to="video/allvideos"
          style={{ color: "inherit", textDecoration: "none" }}
          color="inherit"
        >
          <div className="item">
            <VideoLibraryIcon />
            My Own Videos
          </div>
        </Link>
        <hr style={{ margin: "18px 0", border: "1px solid #373737" }} />
        <div className="item">
          <LibraryAddCheckIcon />
          Library
        </div>
        <div className="item">
          <HistoryIcon />
          History
        </div>
        <div className="item">
          <SettingsIcon />
          Setting
        </div>
        <hr style={{ margin: "18px 0", border: "1px solid #373737" }} />
        {/* <div className="btn">
          Sign in to like, comment to videos
          <Link
            to="/signin"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button type="primary" ghost icon={ <AccountCircleIcon />}>
              SIGN IN
            </Button>
          </Link>
        </div> */}
        {/* <hr style={{ margin: "18px 0", border: "1px solid #373737" }} /> */}

        <div className={"item toogle"} onClick={toggleTheme}>
          <Brightness4Icon />
          Mode
        </div>
      </div>
    </div>
  );
}
