import styles from "./Instructions.module.css";
export default function Instructions() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <p>click on a song to play it in the current context</p>
          <p>
            click on the title of a group to queue all the songs in that group
          </p>
          <p>click on the arrow buttons on the bottom to loop through pages</p>
          <p>click on arrow buttons by "Top 10" to change the time period</p>
        </div>
      </div>
    </>
  );
}
