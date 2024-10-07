import styles from "./datepicker.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, format } from "date-fns";
import { DatePickerProps, DatePickerType } from "./datepicker.types"

const DatePickerComponent: DatePickerType = ({
  handleChange,
  selectedDate,
}: DatePickerProps) => {
  const calculateDaysDifference = (date: Date | null) => {
    if (!date) return 0;
    const today = new Date();
    return differenceInDays(date, today);
  };

  return (
    <div className={styles.DatePicker}>
      <h2>Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        isClearable
      />
      {selectedDate && (
        <div className={styles.SelectedDate}>
          Selected Date: {format(selectedDate, "yyyy-MM-dd")}
          <h3>No. of Days</h3>
          <p>{calculateDaysDifference(selectedDate)} days</p>
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
