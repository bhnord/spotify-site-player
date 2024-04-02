import { useEffect, useState } from "react";
import api, { Artist } from "../../api/api";
import styles from "./TopSongs.module.css";

export default function TopSongs(props: { top: number }) {
  const [top, setTop] = useState([]);
  useEffect(() => {
    async function getTop() {
      const tracks = await api.getTopTracks(props.top);
      setTop(tracks);
    }
    getTop();
  }, [props.top]);

  return (
    <>
      <div className={styles.container}>
        <h3>Ben's Top {props.top}</h3>
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
