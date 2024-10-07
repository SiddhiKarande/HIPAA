import { ErrorPageProps } from "./ErrorPage.types";
import styles from './ErrorPage.module.scss';

const ErrorPage = ({ }: ErrorPageProps) => {
  return (
    <div className={styles.ErrorPage}>
        <h2>Unexpected Application Error!</h2>
        <h3>404 Not Found</h3>
    </div>
  );
};

export default ErrorPage;  
