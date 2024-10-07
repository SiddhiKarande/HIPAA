import { EnrollmentProps } from "./Enrollment.types";
import styles from './Enrollment.module.scss';
import Button from "../../UI components/Button/button";
import { downloadPdf } from "../../../services/FileDownload.service";

const Enrollment = ({ certificationValidTill, enrollmentId, email }: EnrollmentProps) => {

  const d = new Date(certificationValidTill)
  const date = d.toTimeString().split(' ')[0] + " " + d.toDateString();

  return (
    <div className={styles.Enrollment}>
      <p className={styles.Para}>Valid till: {date}</p>
      <Button
        type="button"
        bgColor="success"
        handleClick={() => downloadPdf(enrollmentId, email)}
      >
        Download Certificate
      </Button>
    </div>
  );
};

export default Enrollment;
