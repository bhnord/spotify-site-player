import { useEffect, useState } from "react";
import api from "../../api/api";
import styles from "./Playlists.module.css";

export default function Playlists(props: { num: number; loggedIn: boolean }) {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPageNum] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    async function getPlaylists() {
      const res = await api.getPlaylistsResp(props.num, page * props.num);
      setMaxPage(Math.ceil(res.total / props.num) - 1);
      setPlaylists(res.items);
    }
    getPlaylists();

    //TODO: separate props and offset refresh
  }, [props.num, page]);
  const playOrShow = (uri: string, url: string) => {
    if (props.loggedIn === true) {
      api.playContext(uri);
    } else {
      open(url, "_blank");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.header}>Ben's Playlists</h2>
        <hr />
        <div className={styles.content}>
          <div>
            {playlists ? (
              <ul>
                {playlists.map((playlist) => {
                  //spotify api is returning null playlists??
                  if (!playlist) {
                    return;
                  }
                  const {
                    name,
                    uri,
                    external_urls,
                  }: {
                    name: string;
                    uri: string;
                    external_urls: { spotify: string };
                  } = playlist;

                  return (
                    <li
                      className={styles.info}
                      key={uri}
                      onClick={() => {
                        playOrShow(uri, external_urls.spotify);
                      }}
                    >
                      <div className={styles.playlist}>{`${name}`}</div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div></div>
            )}
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
