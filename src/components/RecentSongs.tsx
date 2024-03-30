import { useEffect, useState } from "react";
import api, { Artist } from "../api/api";

export default function RecentSongs() {
  const [trackHistory, setTrackHistory] = useState([]);

  useEffect(() => {
    async function getHistory() {
      const history = await api.getTrackHistory();
      setTrackHistory(history);
    }
    getHistory();
  }, []);

  return (
    <div className="container">
      <h3>Recent Songs</h3>
      <div>
        {trackHistory.map(({ track }) => (
          <div>
            <div>
              {`${track.name} by ${track.artists.map((artist: Artist) => artist.name).join(", ")}`}{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
