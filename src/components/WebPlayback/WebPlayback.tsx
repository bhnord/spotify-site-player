import { useState, useEffect } from "react";
import styles from "./WebPlayback.module.css";

export default function WebPlayback(props: { token: string }) {
  const track = {
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  };

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  useEffect(() => {
    const scripts = document.body.getElementsByTagName("script");
    const spotify_src = "https://sdk.scdn.co/spotify-player.js";
    for (const script of scripts) {
      //if script already loaded, return;
      if (spotify_src == script.attributes.src.nodeValue) {
        return;
      }
    }

    const script = document.createElement("script");
    script.src = spotify_src;
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "B)",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setPlayer(player);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        },
      );

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  const togglePlay = () => {
    if (player) {
      console.log(player);
      console.log("dd");
      player.togglePlay();
    }
  };

  return (
    <>
      <div className="container">
        <div className={styles["main-wrapper"]}>
          <div className={styles.track}>
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />
            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>

              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => {
                player.previousTrack();
              }}
            >
              &lt;&lt;
            </button>

            <button
              className={styles.button}
              onClick={() => {
                player.togglePlay();
              }}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className={styles.button}
              onClick={() => {
                player.nextTrack();
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
