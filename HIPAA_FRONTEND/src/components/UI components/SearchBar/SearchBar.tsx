import { IoSearch } from "react-icons/io5";
import styles from "./searchbar.module.scss";
import { SearchProps } from "./SearchBar.types";

export default function SearchBar({
  search,
  setSearch,
}: SearchProps) {
  return (
    <div className={styles.SearchBar}>
      <input
        type="search"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <IoSearch/>
  
    </div>
  );
}
