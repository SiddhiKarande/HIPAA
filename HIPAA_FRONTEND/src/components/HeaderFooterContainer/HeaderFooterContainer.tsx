import { HeaderFooterContainerProps } from "./HeaderFooterContainer.types";
import styles from './HeaderFooterContainer.module.scss';

import { Outlet, useNavigate } from "react-router-dom";
import { Roles } from "../../constants";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../../pages/Login/authcontext";
import Button from "../UI components/Button/button";
import { useEffect, useState } from "react";



const Layout = ({}: HeaderFooterContainerProps) => {

const [activeCourses, showActiveCourses] = useState(false);
const [activeUsers, showActiveUsers] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth()!;
const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

const handleActiveCourses = () => {
  showActiveCourses(true)
  showActiveUsers(false)
  navigate('courses')
}
const handleActiveUsers = () => {
  showActiveUsers(true)
  showActiveCourses(false)
  navigate('users/Enrolled')
}
useEffect(() => {
  setCurrentYear(new Date().getFullYear());
}, [])

  return (
    <div className={styles.HeaderFooterContainer}>
      <header className={styles.Header}>
        <div className={styles.Flex}>
          {/* empty image?? */}
          <img src="../../assets/logo.png" alt="" />
          <h1 className={styles.HeaderMain}>
            Hipaa
          </h1>

          <nav className={styles.LeftNav}>
            <h3 className={`${styles.NavHeader} ${activeCourses ? styles.Active : ' '}`} onClick={() => {handleActiveCourses()}}>Courses</h3>
            {auth.userRole === Roles.ADMIN && <h3 className={`${styles.NavHeader} ${activeUsers ? styles.Active : ' '}`} onClick={() => {handleActiveUsers()}}>Users</h3>}
          </nav>
        </div>
        <div className={styles.RightNav}>
          {auth.userRole === Roles.USER
            && <AccountCircleIcon
              className={styles.Logout}
              onClick={() => navigate('/user/profile')}
            />}
          <Button
            type={"button"}
            bgColor={""}
            handleClick={() => {
              localStorage.clear();
              navigate('/');
            }} >Logout</Button>

        </div>
      </header>
      <main className={styles.Outlet}>
        <Outlet />
      </main>

      <footer className={`${styles.Footer}`}>
        <div className={`${styles.Nav} ${styles.Flex}`}>
          <div className={`${styles.Text}`}>
            <p>© {currentYear} Coditas. All rights reserved.</p>
            <p className={styles.Underline}>
              <a href="" target="_blank"
                className={styles.Terms}
              >
                Privacy Policy
              </a>
            </p>
            <p className={styles.Underline}>
              <a href="" target="_blank"
                className={styles.Terms}
              >
                Terms and Conditions
              </a>
            </p>
          </div>
          <div className={styles.Socials}>
            <a href='https://www.linkedin.com/company/coditas'
              target='_blank'
              className={styles.IconContainer}
            >
              <LinkedInIcon className={styles.Icons} />
            </a>
            <a href='https://www.instagram.com/coditas_hq/?hl=en'
              target='_blank'
              className={styles.IconContainer}
            >
              <InstagramIcon className={styles.Icons} />
            </a>
            <a href='https://www.youtube.com/channel/UCif8dj_W8Yq5KMcoqGkbwkA'
              target='_blank'
              className={styles.IconContainer}
            >
              <YouTubeIcon className={styles.Icons} />
            </a>
            <a href='https://www.facebook.com/Coditas/'
              target='_blank'
              className={styles.IconContainer}
            >
              <FacebookIcon className={styles.Icons} />
            </a>
          </div>
        </div>
      </footer>
    </div>


  );
};

export default Layout;  
