import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./RecentSongs.module.css";

export default function RecentSongs() {
  const [trackHistory, setTrackHistory] = useState([]);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    async function getHistory() {
      const history = await api.getTrackHistory();
      setTrackHistory(history);
    }
    getHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h3>Recent Songs</h3>
      <div className={styles.content}>
        <div>
          <ul>
            {trackHistory.map(({ track, played_at }) => {
              const curr = new Date(played_at);
              return (
                <li className={styles.info}>
                  <div className={styles.track}>
                    {`${track.name} by ${track.artists.map((artist: Artist) => artist.name).join(", ")}`}
                  </div>
                  <div className={styles.date}>
                    {`${days[curr.getDay()]} ${curr.getMonth() + 1}-${curr.getDate()}`}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
