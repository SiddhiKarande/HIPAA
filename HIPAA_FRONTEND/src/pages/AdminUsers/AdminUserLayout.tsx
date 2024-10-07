import styles from "./AdminUserLayout.module.scss";
import { Sidebar } from "../../components/Admin/Users/Sidebar/Sidebar.tsx";
import 'react-toastify/dist/ReactToastify.css';
import { AdminUserLayoutProps } from "./AdminUserLayout.states.ts";
import { Outlet } from "react-router-dom";

const AdminUserLayout = ({}: AdminUserLayoutProps) => {
  return (
      <div className={styles.AdminUsers}>
        <Sidebar />
        <div className={styles.Users}>
          <Outlet/>
        </div>
      </div>
  );
};

export default AdminUserLayout;
