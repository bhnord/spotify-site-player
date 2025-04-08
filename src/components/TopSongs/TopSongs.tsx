import { useEffect, useState } from "react";
import api, { Artist, Track } from "../../api/api";
import styles from "./TopSongs.module.css";

export default function TopSongs(props: { top: number; loggedIn: boolean }) {
  const [topSongs, setTopSongs] = useState([]);
  const [range, setRange] = useState(2);

  useEffect(() => {
    async function getTop() {
      const tracks = await api.getTopTracks(props.top, range);
      setTopSongs(tracks);
    }
    getTop();
  }, [props.top, range]);

  const playOrShow = (uri: string, url: string) => {
    if (props.loggedIn === true) {
      api.play(uri);
    } else {
      open(url, "_blank");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <section id={styles.header}>
          <div
            id={styles.last}
            onClick={() => {
              setRange((range - 1) % 3);
            }}
          >
            &lt;
          </div>

          <div
            id={styles.title}
            onClick={async () => {
              for (const { uri } of topSongs) {
                await api.addToQueue(uri);
              }
            }}
          >
            Ben's Top {props.top} -{" "}
            {range === 0 ? "4wk" : range === 1 ? "6mo" : "1yr"}
          </div>

          <div
            id={styles.next}
            onClick={() => {
              setRange((range + 1) % 3);
            }}
          >
            &gt;
          </div>
        </section>

        <hr />
        <div className={styles.content}>
          <div>
            <ul>
              {topSongs.map((song, index) => {
                if (!song) {
                  return;
                }
                const { name, artists, uri, external_urls }: Track = song;
                return (
                  <li
                    className={styles.info}
                    onClick={() => {
                      playOrShow(uri, external_urls.spotify);
                    }}
                    key={uri}
                  >
                    <div className={styles.track}>
                      <span>{`${name}`}</span>
                      <span
                        style={{ color: "#f7d6c5", opacity: 0.5 }}
                      >{` by ${artists.map((artist: Artist) => artist.name).join(", ")}`}</span>
                    </div>
                    <div className={styles.ranking}>{`${index + 1}`}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
