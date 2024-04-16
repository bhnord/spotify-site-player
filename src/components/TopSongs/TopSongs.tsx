import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./TopSongs.module.css";

export default function TopSongs(props: { top: number; range: number }) {
  const [top, setTop] = useState([]);
  const period = props.range === 0 ? "4wk" : props.range === 1 ? "6mo" : "1yr";
  useEffect(() => {
    async function getTop() {
      const tracks = await api.getTopTracks(props.top, props.range);
      console.log(tracks);
      setTop(tracks);
    }
    getTop();
  }, [props.top, props.range]);

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.header}>
          Ben's Top {props.top} - {period}
        </h2>
        <hr />
        <div className={styles.content}>
          <div>
            <ul>
              {top.map(
                (
                  { name, artists }: { name: string; artists: Array<Artist> },
                  index,
                ) => (
                  <li className={styles.info}>
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
