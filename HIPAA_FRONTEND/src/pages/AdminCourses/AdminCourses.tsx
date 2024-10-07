import styles from "./AdminCourses.module.scss";
import ModuleList from "../../components/Admin/Course/ModuleList/ModuleList.tsx";
import { useContext, useEffect } from "react";
import {
  AdminCourseContext,
  WithAdminCourseProvider,
} from "./AdminCourseContext.tsx";

const AdminCourses = () => {
  const { state, getModules } = useContext(AdminCourseContext)!;
 
  useEffect(() => {
    getModules();
  }, []);

  return (
    <div className={styles.AdminCourses}>
      <h1 className={styles.Header}>HIPAA Training Course</h1>
      {state.loading && <p>Loading...</p>}
      <ModuleList  />
    </div>
  );
};

export default WithAdminCourseProvider(AdminCourses);
