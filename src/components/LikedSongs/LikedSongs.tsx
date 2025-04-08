import { useEffect, useState } from "react";
import styles from "./LikedSongs.module.css";
import api from "../../api/api";
import { Artist, SongsResponse, Item } from "../../api/api";

export default function LikedSongs(props: { num: number; loggedIn: boolean }) {
  const [liked_songs, setLikedSongs] = useState<Item[]>([]);
  const [page, setPageNum] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  useEffect(() => {
    async function getSongs() {
      const res: SongsResponse = await api.getLikedSongsResp(
        props.num,
        page * props.num,
      );
      setMaxPage(Math.ceil(res.total / props.num) - 1);
      setLikedSongs(res.items);
    }
    getSongs();
  }, [props.num, page]);

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
        <h2
          className={styles.header}
          onClick={async () => {
            for (const { track } of liked_songs) {
              await api.addToQueue(track.uri);
            }
          }}
        >
          Ben's Liked Songs
        </h2>
        <hr />
        <div className={styles.content}>
          <div>
            <ul>
              {liked_songs.map((liked_song) => {
                if (!liked_song) {
                  return;
                }
                const { track, added_at } = liked_song;
                const curr = new Date(added_at);
                return (
                  <li
                    className={styles.info}
                    onClick={() => {
                      playOrShow(track.uri, track.external_urls.spotify);
                    }}
                    key={track.uri}
                  >
                    <div className={styles.track}>
                      <span>{`${track.name}`}</span>
                      <span
                        style={{ color: "#f7d6c5", opacity: 0.5 }}
                      >{` by ${track.artists.map((artist: Artist) => artist.name).join(", ")}`}</span>
                    </div>
                    <div className={styles.date}>
                      {`${curr.getMonth() + 1}-${curr.getDate()}-${curr.getFullYear()}`}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <section id={styles.footer}>
          <div
            id={styles.last}
            onClick={() => {
              setPageNum(Math.max(0, page - 1));
            }}
          >
            &lt;
          </div>
          <div>
            page {page + 1} / {maxPage + 1}
          </div>
          <div
            id={styles.next}
            onClick={() => {
              setPageNum(Math.min(page + 1, maxPage));
            }}
          >
            &gt;
          </div>
        </section>
      </div>
    </>
  );
}
