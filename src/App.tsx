import { useState, useEffect } from "react";
import WebPlayback from "./components/WebPlayback";
import Login from "./components/Login";
import "./App.css";
import api from "./api/api";
import RecentSongs from "./components/RecentSongs";
import TopSongs from "./components/TopSongs";

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
        <div className="container">
          <TopSongs top={5} />
          <RecentSongs />

          <WebPlayback token={token} />
        </div>
      )}
    </div>
  );
}

export default App;
