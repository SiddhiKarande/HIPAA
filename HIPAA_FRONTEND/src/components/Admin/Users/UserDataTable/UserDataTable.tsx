import { UserDataTableProps } from "./UserDataTable.types";
import styles from "./UserDataTable.module.scss";

const UserDataTable = ({
  columns,
  userData,
  renderAction,
}: UserDataTableProps<T>) => {
  return (
    <div className={styles.TableContainer}>
      <table className={styles.UserTable}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id}>{column.columnName}</th>
            ))}
            <th>Action/Status</th>
          </tr>
        </thead>
        <tbody>
          {userData && userData.map((data, index) => (
            <tr key={data._id}>
              {columns.map((column) => {
                const value = data.userId
                ? data.userId[column.id]
                : data[column.id] ;
                const value2= data.user
                ? data.user[column.id]
                : null ;
                return <td key={`${data._id}-${column.id}`}>
                        {value || value2 || data[column.id]}
                        </td>;
              })}
              {renderAction && renderAction(data, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataTable;
