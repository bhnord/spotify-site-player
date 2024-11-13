import { useState, useEffect } from "react";
import styles from "./WebPlayback.module.css";
import api from "../../api/api";

type Player =
  | {
      togglePlay(): void;
      nextTrack(): void;
      previousTrack(): void;
    }
  | undefined;
type WebPlaybackPlayer =
  | {
      context: Context;
      disallows: {
        // A simplified set of restriction controls for
        pausing: false; // The current track. By default, these fields
        peeking_next: false; // will either be set to false or undefined, which
        peeking_prev: false; // indicates that the particular operation is
        resuming: false; // allowed. When the field is set to `true`, this
        seeking: false; // means that the operation is not permitted. For
        skipping_next: false; // example, `skipping_next`, `skipping_prev` and
        skipping_prev: false; // `seeking` will be set to `true` when playing an
        // ad track.
      };
      paused: false; // Whether the current track is paused.
      position: 0; // The position_ms of the current track.
      repeat_mode: 0; // The repeat mode. No repeat mode is 0,
      // repeat context is 1 and repeat track is 2.
      shuffle: false; // True if shuffled, false otherwise.
      track_window: {
        current_track: WebPlaybackTrack; // The track currently on local playback
      };
    }
  | undefined;

type Context =
  | {
      uri: string; // The URI of the context (can be null)
      metadata: { context_description: string } | null;
    }
  | undefined;

type WebPlaybackTrack =
  | {
      uri: "spotify:track:xxxx"; // Spotify URI
      id: "xxxx"; // Spotify ID from URI (can be null)
      type: "track"; // Content type: can be "track", "episode" or "ad"
      media_type: "audio"; // Type of file: can be "audio" or "video"
      name: "Song Name"; // Name of content
      is_playable: true; // Flag indicating whether it can be played
      album: {
        uri: "spotify:album:xxxx"; // Spotify Album URI
        name: "Album Name";
        images: [{ url: "https://image/xxxx" }];
      };
      artists: [{ uri: "spotify:artist:xxxx"; name: "Artist Name" }];
    }
  | undefined;

export default function WebPlayback(props: { token: string }) {
  const [player, setPlayer] = useState<Player>(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<WebPlaybackTrack>(undefined);
  const [device_id, setDeviceId] = useState("");
  const [context, setContext] = useState<Context>(undefined);
  useEffect(() => {
    const scripts = document.body.getElementsByTagName("script");
    const spotify_src = "https://sdk.scdn.co/spotify-player.js";
    for (const script of scripts) {
      //if script already loaded, return;
      console.log(typeof script);
      console.log(script.attributes);
      if (spotify_src == script.attributes.getNamedItem("src")?.nodeValue) {
        return;
      }
    }

    const script = document.createElement("script");
    script.src = spotify_src;
    script.async = true;

    document.body.appendChild(script);

    //@ts-expect-error not recognize script bound func
    window.onSpotifyWebPlaybackSDKReady = () => {
      //@ts-expect-error not recognize script bound class
      const player = new window.Spotify.Player({
        name: "WebPlayer",
        getOAuthToken: (cb: (arg: string) => void) => {
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

      player.addListener("player_state_changed", (state: WebPlaybackPlayer) => {
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
      player?.togglePlay();
    } else {
      api.togglePlay();
    }
  };

  const skip = () => {
    if (is_active) {
      player?.nextTrack();
    } else {
      api.skipToNext();
    }
  };

  const last = () => {
    if (is_active) {
      player?.previousTrack();
    } else {
      api.skipToPrevious();
    }
  };

  //TODO: fix some issues getting metadata

  return (
    <>
      <div className="container">
        <div className={styles["main-wrapper"]}>
          {is_active && current_track ? (
            <div>
              {context &&
              "uri" in context &&
              context.uri !== "" &&
              context.uri !== "-" ? (
                <div className={styles.playlist}>
                  <span>Playing From...</span>
                  <div>
                    <span style={{ textTransform: "capitalize" }}>
                      {context.uri.split(":")[1]}:{" "}
                    </span>
                    {context.metadata?.context_description}
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
