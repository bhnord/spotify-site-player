import { useEffect } from "react";
import WebPlayback from "./components/WebPlayback/WebPlayback";
import Login from "./components/Login";
import "./App.css";
import api from "./api/api";
import RecentSongs from "./components/RecentSongs/RecentSongs";
import TopSongs from "./components/TopSongs/TopSongs";
import Playlists from "./components/Playlists/Playlists";
import LikedSongs from "./components/LikedSongs/LikedSongs";
import Instructions from "./components/Instructions/Instructions";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("access_token") || "";
  const refreshToken = urlParams.get("refresh_token") || "";

  useEffect(() => {
    async function getToken() {
      api.token = token;
      api.refreshToken = refreshToken;
    }
    getToken();
  }, []);

  const togglePopup = () => {
    const popup = document.getElementById("help-popup");
    const background = document.getElementById("background-opacity");
    popup?.classList.toggle("hidden");
    background?.classList.toggle("hidden");
  };

  const playOnDevice = async () => {
    const availableDevices = await api.getAvailableDevices();

    console.log(availableDevices);
  };

  return (
    <div>
      <>
        <div id="background-opacity" className="hidden"></div>
        <div className="button-bar">
          <button className="help-button" onClick={togglePopup}>
            ?
          </button>
          <button className="play-on-pi-button hidden" onClick={playOnDevice}>
            play on device
          </button>
        </div>
        <div id="container">
          <div id="help-popup" className="hidden">
            <button id="close-popup-button" onClick={togglePopup}>
              X
            </button>
            <Instructions />
          </div>

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
              <Playlists num={10} loggedIn={token !== ""} />
            </div>
          </div>
        </div>
        {token === "" ? (
          <Login />
        ) : (
          <div id="playback">
            <WebPlayback token={token} />
          </div>
        )}
      </>
    </div>
  );
}

export default App;
