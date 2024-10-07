import { Audio } from "react-loader-spinner";
import styles from "./Loader.module.scss";
const Loader = () => {
  return (
    <div className={styles.Audio}>
      <Audio
        ariaLabel="loading"
        color="rgb(33, 150, 243)"
      />
    </div>
  );
};

export default Loader;
