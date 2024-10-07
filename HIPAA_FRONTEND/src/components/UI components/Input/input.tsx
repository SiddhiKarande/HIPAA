import { forwardRef } from "react";
import styles from "./Input.module.scss";
import { InputProps } from "./Input.types";



const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, register }, ref) => {
    return (
      <div className={styles.Input}>
        <input
          {...register}
          placeholder={placeholder}
          className={styles.FormField}
          type={type}
          ref={ref}
        />
      </div>
    );
  }
);

export default Input;
