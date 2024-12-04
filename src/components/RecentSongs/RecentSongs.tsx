import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./RecentSongs.module.css";
import { Item } from "../../api/api";

export default function RecentSongs() {
  const [trackHistory, setTrackHistory] = useState<Item[]>([]);
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  useEffect(() => {
    async function getHistory() {
      let history = await api.getTrackHistory(20);

      const songs: { [id: string]: string } = {};
      history = history.filter((val: Item) => {
        const uniq = !(val.track.uri in songs);
        songs[val.track.uri] = "x";
        return uniq;
      });
      history = history.slice(0, Math.min(history.length, 10));
      setTrackHistory(history);
    }
    getHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h2
        id={styles.header}
        onClick={async () => {
          for (const { track } of trackHistory) {
            await api.addToQueue(track.uri);
          }
        }}
      >
        Recent Songs
      </h2>
      <hr />
      <div className={styles.content}>
        <div>
          <ul>
            {trackHistory.map((historyItem) => {
              if (!historyItem) {
                return;
              }
              const {
                track,
                played_at,
              }: {
                track: { uri: string; name: string; artists: Artist[] };
                played_at: string;
              } = historyItem;
              const curr = new Date(played_at);
              return (
                <li
                  key={track.uri}
                  className={styles.info}
                  onClick={() => {
                    api.play(track.uri);
                  }}
                >
                  <div className={styles.track}>
                    <span>{`${track.name}`}</span>
                    <span
                      style={{ color: "#f7d6c5", opacity: 0.5 }}
                    >{` by ${track.artists.map((artist: Artist) => artist.name).join(", ")}`}</span>
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
