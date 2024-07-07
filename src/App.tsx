import { useState, useEffect } from "react";
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

  const togglePopup = () => {
    const popup = document.getElementById("help-popup");
    const background = document.getElementById("background-opacity");
    popup?.classList.toggle("hidden");
    background?.classList.toggle("hidden");
  };

  const playOnPi = async () => {
    const availableDevices = await api.getAvailableDevices();

    availableDevices.devices.map(
      async ({ id, name }: { id: string; name: string }) => {
        if (name === "raspberry pi") {
          console.log(id);
          await api.transferPlayback([id]);
          await api.play();
        }
      },
    );
  };

  return (
    <div>
      {token === "" ? (
        <Login />
      ) : (
        <>
          <div id="background-opacity" className="hidden"></div>
          <div className="button-bar">
            <button className="help-button" onClick={togglePopup}>
              ?
            </button>
            <button className="play-on-pi-button" onClick={playOnPi}>
              play on pi
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
                <Playlists num={10} />
              </div>
            </div>
          </div>
          <div id="playback">
            <WebPlayback token={token} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
