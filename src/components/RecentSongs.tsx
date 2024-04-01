import { useEffect, useState } from "react";
import api, { Artist } from "../api/api";

export default function RecentSongs() {
  const [trackHistory, setTrackHistory] = useState([]);
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

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
        {trackHistory.map(({ track, played_at }) => {
          const curr = new Date(played_at);
          return (
            <div>
              <div>
                {`${track.name} by ${track.artists.map((artist: Artist) => artist.name).join(", ")} on ${days[curr.getDay()]} ${curr.getMonth() + 1}-${curr.getDate()}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
