import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./RecentSongs.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.header}>Recent Songs</h2>
      <hr />
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
