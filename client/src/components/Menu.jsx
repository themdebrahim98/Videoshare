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
import { Button, Space, Drawer, Radio } from "antd";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useContext } from "react";
import { ThemeContext } from "../App.js";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { GrChannel } from "react-icons/gr";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { toggleSideBar, toggleButton } from "../redux/sideBarSlice";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Menu() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { key } = useSelector((state) => state.sideBar);
  const { isopen } = useSelector((state) => state.sideBar);

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const showDrawer = () => {
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    dispatch(toggleSideBar());
  };

  const handleSideBar = () => {
    dispatch(toggleSideBar());
  };
  return (
    <Drawer
      maskClosable={true}
      style={{ padding: "0", background: "#0f0f0f", color: "white" }}
      closable={false}
      className="drawer"
      placement={"left"}
      width={350}
      open={isopen}
      onClose={onClose}
    >
      <div className={theme == "dark" ? "menu" : "menu lightTheme"}>
        <div className="wrapper">
          <div className="logowrap">
            <MenuIcon
              onClick={() => {
                dispatch(toggleSideBar());
              }}
            />
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "none" }}
              color="inherit"
            >
              <div className="logo">
                <img src={logo} width="40px" height="50px" alt="" />
                VIDEO SHARE
              </div>
            </Link>
          </div>

          <Link
            onClick={handleSideBar}
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
            color="inherit"
          >
            <div
              className={key == 1 ? "item activeItem" : "item"}
              onClick={() => dispatch(toggleButton(1))}
            >
              <HomeIcon />
              Home
            </div>
          </Link>

          <Link
            onClick={handleSideBar}
            to="video/trend"
            style={{ color: "inherit", textDecoration: "none" }}
            color="inherit"
          >
            <div
              className={key == 2 ? "item activeItem" : "item"}
              onClick={() => dispatch(toggleButton(2))}
            >
              <ExploreIcon />
              Trend
            </div>
          </Link>

          <Link
            onClick={handleSideBar}
            to="/video/sub"
            style={{ color: "inherit", textDecoration: "none" }}
            color="inherit"
          >
            <div
              className={key == 3 ? "item activeItem" : "item"}
              onClick={() => dispatch(toggleButton(3))}
            >
              <SubscriptionsIcon />
              Subscription
            </div>
          </Link>

          <Link
            onClick={handleSideBar}
            to="video/allvideos"
            style={{ color: "inherit", textDecoration: "none" }}
            color="inherit"
          >
            <div
              className={key == 4 ? "item activeItem" : "item"}
              onClick={() => dispatch(toggleButton(4))}
            >
              <VideoLibraryIcon />
              My Own Videos
            </div>
          </Link>
          <hr style={{ margin: "18px 0", border: "1px solid #373737" }} />
          <div
            onClick={handleSideBar}
            className={key == 5 ? "item activeItem" : "item"}
            onClick={() => dispatch(toggleButton(5))}
          >
            <LibraryAddCheckIcon />
            Library
          </div>
          <div
            onClick={handleSideBar}
            className={key == 6 ? "item activeItem" : "item"}
            onClick={() => dispatch(toggleButton(6))}
          >
            <HistoryIcon />
            History
          </div>
          <div
            onClick={handleSideBar}
            className={key == 7 ? "item activeItem" : "item"}
            onClick={() => dispatch(toggleButton(7))}
          >
            <SettingsIcon />
            Setting
          </div>
          <hr style={{ margin: "18px 0", border: "1px solid #373737" }} />
        </div>
      </div>
    </Drawer>

      );
}
