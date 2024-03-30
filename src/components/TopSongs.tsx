import { useEffect, useState } from "react";
import api, { Artist } from "../api/api";

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
      <div className="container">
        <h3>Ben's Top {props.top}</h3>
        <div>
          {top.map(
            ({ name, artists }: { name: string; artists: Array<Artist> }) => (
              <div>
                {`${name} by ${artists.map((artist) => artist.name).join(", ")}`}
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
}
