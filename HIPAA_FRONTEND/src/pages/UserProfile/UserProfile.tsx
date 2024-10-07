import { EnrollmentProps, UserProfileProps } from "./UserProfile.types";
import styles from './UserProfile.module.scss';

import { useContext, useEffect } from "react";
import Enrollment from "../../components/User/Enrollment/Enrollment";
import { UserContext, WithUserProfileProvider } from "./UserProfileContext";

const UserProfile = ({ }: UserProfileProps) => {

  const { 
    state, 
    getProfileData 
  } = useContext(UserContext)!;

  useEffect(() => {
    getProfileData();
  }, [] )

  return (
    <div className={styles.UserProfile}>
      <div className={styles.UserDetails}>
        <img 
          src={`${state.pictureUrl}`}
          referrerPolicy="no-referrer"
          className={styles.Logo}
        />
        <div className={styles.UserInfo}>
          <p className={styles.UserName}>
            {state.firstName} {state.lastName}
          </p>
          <div className={styles.Flex}>
            <p className={styles.Text}>{state.designation}</p>
            <p className={styles.Text}>{state.email}</p>
            <p className={styles.Text}>{state.department}</p>
          </div>
        </div>
      </div>
      <p className={styles.CertificateTitle}>
          Your Certificates: 
        </p>
      <div className={styles.Certificates}>
        {state.enrollments 
        && state.enrollments.length > 0 
        && state.enrollments.filter((enrollment: EnrollmentProps) => enrollment.status === 'completed')
        .map((enrollment, index) => {
          return (
            <Enrollment
              key={index}
              certificationValidTill={enrollment.certificationValidTill}
              email={state.email}
              enrollmentId={enrollment._id}
            />)
        })}
      </div>
    </div>
  );
};

export default WithUserProfileProvider(UserProfile);  
