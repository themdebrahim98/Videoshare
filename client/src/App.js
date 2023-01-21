import { createContext, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
export const ThemeContext = createContext(null);
function App() {
  const [theme, settheme] = useState("dark");
  const toggleTheme = () => {
    settheme(theme == "light" ? "dark" : "light");
  };
  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme }}>
      <div className="App">
        <div className="container">
          <BrowserRouter>
            <Menu />
            <div className={theme == "dark" ? "main" : "main lightTheme"}>
              <Navbar />
              <div className="mainpageWrapper">
                <Routes>
                  <Route path="/">
                    <Route index element={<Home type="random" />} />
                    <Route path="trend" element={<Home type="trend" />} />
                    <Route path="sub" element={<Home type="sub" />} />
                  </Route>
                  <Route path="/video/:id" element={<Video />} />
                  <Route path="/video/trend" element={<Video />} />
                  <Route path="/video/subscribe" element={<Video />} />
                  <Route path="/video/:id" element={<Video />} />
                  <Route path="/signin" element={<Signin />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
