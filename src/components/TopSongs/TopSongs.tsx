import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./TopSongs.module.css";

export default function TopSongs(props: { top: number }) {
  const [topSongs, setTopSongs] = useState([]);
  const [range, setRange] = useState(2);

  useEffect(() => {
    async function getTop() {
      const tracks = await api.getTopTracks(props.top, range);
      setTopSongs(tracks);
    }
    getTop();
  }, [props.top, range]);

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

          <div id={styles.title}>
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
              {topSongs.map(
                (
                  {
                    name,
                    artists,
                    uri,
                  }: { name: string; artists: Array<Artist>; uri: string },
                  index,
                ) => (
                  <li
                    className={styles.info}
                    onClick={() => {
                      api.play(uri);
                    }}
                  >
                    <div className={styles.track}>
                      {`${name} by ${artists.map((artist) => artist.name).join(", ")}`}
                    </div>
                    <div className={styles.ranking}>{`${index + 1}`}</div>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
