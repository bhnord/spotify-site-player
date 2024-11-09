import { useState, useEffect } from "react";
import styles from "./WebPlayback.module.css";
import api from "../../api/api";

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
  const [device_id, setDeviceId] = useState("");
  const [context, setContext] = useState({});
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
        name: "WebPlayer",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);

        //set playback to app
        api.transferPlayback([device_id]);
        setDeviceId(device_id);
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
          setActive(false);
        }

        setContext(state.context);
        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        !state.track_window.current_track ? setActive(false) : setActive(true);
      });

      player.addListener("autoplay_failed", () => {
        console.log("Autoplay is not allowed by the browser autoplay rules");
      });
      player.connect();
    };
  }, []);

  const togglePlay = function () {
    if (is_active) {
      player.togglePlay();
    } else {
      api.togglePlay();
    }
  };

  const skip = () => {
    if (is_active) {
      player.nextTrack();
    } else {
      api.skipToNext();
    }
  };

  const last = () => {
    if (is_active) {
      player.previousTrack();
    } else {
      api.skipToPrevious();
    }
  };

  //TODO: fix some issues getting metadata

  return (
    <>
      <div className="container">
        <div className={styles["main-wrapper"]}>
          {is_active && current_track !== null ? (
            <div>
              {context.uri !== "" && "uri" in context ? (
                <div className={styles.playlist}>
                  <span>Playing From...</span>
                  <div>
                    <span style={{ textTransform: "capitalize" }}>
                      {context.uri.split(":")[1]}:{" "}
                    </span>
                    {context.metadata.context_description}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div className={styles.track}>
                <img
                  src={current_track.album.images[0].url}
                  alt=""
                  className={styles["now-playing-cover"]}
                />
                <div className={styles["now-playing"]}>
                  <div className={styles["curr-track"]}>
                    {current_track.name}
                  </div>
                  <div className={styles.artist}>
                    {current_track.artists[0].name}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>[ player is inactive ]</div>
              <button
                className={styles.button}
                onClick={() => {
                  api.transferPlayback([device_id]);
                }}
              >
                RECONNECT PLAYER
              </button>
            </div>
          )}
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => {
                last();
              }}
            >
              &lt;&lt;
            </button>

            <button className={styles.button} onClick={togglePlay}>
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className={styles.button}
              onClick={() => {
                skip();
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
      {
        //TODO: add song list if context exists
        /*
      <div className={styles["main-wrapper"]}>
        add song list if context not-null
      </div>
         */
      }
    </>
  );
}
