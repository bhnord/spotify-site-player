import { useEffect, useState } from "react";
import api from "../../api/api";
import styles from "./Playlists.module.css";

export default function Playlists(props: { num: number }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function getPlaylists() {
      const playlists = await api.getPlaylists(props.num);
      setPlaylists(playlists);
    }

    getPlaylists();
  }, [props.num]);

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.header}>Ben's Playlists</h2>
        <hr />
        <div className={styles.content}>
          <div>
            <ul>
              {playlists.map(({ name, uri }: { name: string; uri: string }) => (
                <li className={styles.info}>
                  <div
                    className={styles.playlist}
                    onClick={() => {
                      api.playContext(uri);
                    }}
                  >
                    {`${name}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
