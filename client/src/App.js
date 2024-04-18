import { createContext, useState, useEffect } from "react";
import "./App.css";
import Card from "./components/Card";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/userSlice";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNavigate } from "react-router-dom";
export const ThemeContext = createContext(null);

function App() {
  let { isopen } = useSelector((state) => state.sideBar);
  const [theme, settheme] = useState("dark");
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const toggleTheme = () => {
    settheme(theme == "light" ? "dark" : "light");
  };

  useEffect(() => {
    function getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    const haveCookie = getCookie("user-token");

    if (haveCookie == "") {
      dispatch(logout());
    }
  }, []);

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ theme: theme, toggleTheme }}>
        <div className="App">
          <div className="container">
            {isopen && <Menu />}
            <div className={theme == "dark" ? "main" : "main lightTheme"}>
              <Navbar />
              <div className="mainpageWrapper">
                <Routes>
                  <Route path="/">
                    <Route index element={<Home type="random" />} />
                  </Route>

                  <Route path="/video">
                    <Route index path=":id" element={<Video />} />
                    <Route path="search" element={<Search />} />
                    <Route path="trend" element={<Home type="trend" />} />
                    <Route
                      path="sub"
                      element={
                        <ProtectedRoute>
                          <Home type="sub" />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="allvideos"
                      element={
                        <ProtectedRoute>
                          <Home type="allvideos" />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  <Route path="/signin" element={<Signin />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
