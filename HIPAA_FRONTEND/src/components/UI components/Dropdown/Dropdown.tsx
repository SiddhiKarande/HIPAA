import { DropdownProps } from "./Dropdown.types";
import styles from './Dropdown.module.scss';

const Dropdown = ({ items, showFilter, setFilter, onClick }: DropdownProps) => {
  
  return (
  <div className={styles.Dropdown}>
      <select  className={styles.Dropdown}>
      {items.map((item: string, index: number) => {
        return (
          <option
            key={index}
            onClick={() => {
              setFilter(item);
              onClick(!showFilter);
            }}
            className={styles.ListItem}
          >
            {item}
          </option>
        )
      })}
    </select>
  </div>
  );
};

export default Dropdown;  
