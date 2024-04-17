import { useEffect, useState } from "react";
import styles from "./LikedSongs.module.css";
import api from "../../api/api";

export default function LikedSongs(props: { num: number }) {
  const [liked_songs, setLikedSongs] = useState([]);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    console.log("dd");
    async function getSongs() {
      const songs = await api.getLikedSongs(props.num, offset);
      setLikedSongs(songs);
      console.log(songs);
    }
    getSongs();
  }, [props.num, offset]);

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.header}>Ben's Liked Songs</h2>
        <hr />
        <div className={styles.content}>
          <div>
            <ul>
              {liked_songs.map(
                ({ track, added_at }: { name: string; uri: string }) => {
                  const curr = new Date(added_at);
                  return (
                    <li className={styles.info}>
                      <div
                        className={styles.track}
                        onClick={() => {
                          api.play(track.uri);
                        }}
                      >
                        {`${track.name} by ${track.artists.map((artist: Artist) => artist.name).join(", ")}`}
                      </div>
                      <div className={styles.date}>
                        {`${curr.getMonth() + 1}-${curr.getDate()}-${curr.getFullYear()}`}
                      </div>
                    </li>
                  );
                },
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
