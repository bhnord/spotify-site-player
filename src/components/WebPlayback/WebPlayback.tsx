import { useState, useEffect } from "react";
import styles from "./WebPlayback.module.css";

export default function WebPlayback(props: { token: string }) {
  const [, setPlayer] = useState(undefined);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Ben's Playback B)",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        },
      );

      player.connect();
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className={styles["main-wrapper"]}>
          <button className={styles.btn}>{"<<"}</button>
          <div>rect</div>
          <button className={styles.btn}>{">>"}</button>
        </div>
      </div>
    </>
  );
}