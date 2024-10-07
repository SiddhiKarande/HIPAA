import { useEffect } from "react";
import styles from "./Pagination.module.scss";
import { PaginationProps } from "./Pagination.types";
import { PiGreaterThanLight, PiLessThanLight } from "react-icons/pi";

const Pagination = ({pagenumber,setPageNumber,totalPages }: PaginationProps) => {


  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  useEffect(() => {

  }, [ pagenumber]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.PageNumber} ${i === pagenumber ? styles.Active : ''}`}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className={styles.PaginationContainer}>
      <div className={styles.Pagination}>
        <button
          className={styles.PageControl}
          onClick={() => handleClick(pagenumber - 1)}
          disabled={pagenumber === 1}
        >
          <PiLessThanLight />
        </button>
        {renderPageNumbers()}
        <button
          className={styles.PageControl}
          onClick={() => handleClick(pagenumber + 1)}
          disabled={pagenumber === totalPages}
        >
          <PiGreaterThanLight />
        </button>
      </div>
   
    </div>
  );
};

export default Pagination;
