import { FaUser } from "react-icons/fa";
import styles from "./Sidebar.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SIDEBAR = ["Enrolled", "UnEnrolled", "Certified","Nominated"];
export const Sidebar = () => {
  const navigate = useNavigate();
  const [showActive, setShowActive] = useState("");

  const handleShowActive = (item: string) => {
    setShowActive(item)
    navigate(`/admin/users/${item}`);
  }
  return (
    <div className={styles.UserTypes}>
      <h1 className={styles.UsersHeading}>Users</h1>
      {SIDEBAR.map((item, index) => (
        <div
          key={item}
          className={`${styles.UserTypeBtn} ${showActive === item ? styles.Active : '' }`}
          onClick={() => {
              handleShowActive(item)
          }}
        >
          <FaUser style={{ backgroundColor: "transparent" }}  size={10}/>
          <p className={styles.Para}>{item}</p>
        </div>
      ))}
    </div>
  );
};
