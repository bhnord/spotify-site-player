import { useState, useEffect } from "react";
import WebPlayback from "./components/WebPlayback/WebPlayback";
import Login from "./components/Login";
import "./App.css";
import api from "./api/api";
import RecentSongs from "./components/RecentSongs/RecentSongs";
import TopSongs from "./components/TopSongs/TopSongs";
import Playlists from "./components/Playlists/Playlists";
import LikedSongs from "./components/LikedSongs/LikedSongs";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const token = await api.getToken();
      setToken(token);
      if (token === "") {
        open("/auth/login", "_self");
      }
    }
    getToken();
  }, []);

  return (
    <div>
      {token === "" ? (
        <Login />
      ) : (
        <>
          <div id="container">
            <div className="section-column">
              <div className="section-row">
                <TopSongs top={10} />
              </div>
              <div className="section-row">
                <RecentSongs />
              </div>
            </div>
            <div className="section-column">
              <div className="section-row">
                <LikedSongs num={10} />
              </div>
              <div className="section-row">
                <Playlists num={10} />
              </div>
            </div>
          </div>
          <div id="playback">
            <WebPlayback token={token} />
          </div>
        </>
      )}

      <br />
      <br />
      <br />
      <br />
      <div>copyright: yo mama</div>
    </div>
  );
}

export default App;
