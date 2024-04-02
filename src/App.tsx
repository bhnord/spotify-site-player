import { useState, useEffect } from "react";
import WebPlayback from "./components/WebPlayback/WebPlayback";
import Login from "./components/Login";
import "./App.css";
import api from "./api/api";
import RecentSongs from "./components/RecentSongs/RecentSongs";
import TopSongs from "./components/TopSongs/TopSongs";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const token = await api.getToken();
      setToken(token);
    }
    getToken();
  }, []);

  return (
    <div>
      {token === "" ? (
        <Login />
      ) : (
        <div id="container">
          <div className="section-column">
            <div className="section-row">
              <TopSongs top={5} />
            </div>
            <div className="section-row" style={{ backgroundColor: "black" }}>
              <WebPlayback token={token} />
            </div>
          </div>
          <div className="section-column">
            <RecentSongs />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
