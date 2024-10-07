import { useNavigate } from "react-router-dom";
import Button from "../../../UI components/Button/button";
import { ModuleFormFieldsProps } from "./ModuleForm.types.ts";
import styles from "./ModuleForm.module.scss";
const ModuleFormFields: React.FC<ModuleFormFieldsProps> = ({
  register,
  errors,
  watch,
  isEditMode,
  _id,
}) => {
  const questionsPerQuiz = watch("questionsPerQuiz");
  const navigate = useNavigate();
  return (
    <div className={styles.InputContainer}>
      <div className={styles.FormDiv}>
        <div className={styles.FormInputWithError}>
          <input
            {...register("name", {
              required: true,
              minLength: 5,
              maxLength: 60,
            })}
            placeholder="Module title"
            className={styles.FormField}
          />
          {errors.name?.type === "required" && (
            <p className={styles.ValidationAlert}>Module title is required</p>
          )}
          {errors.name && (
            <p className={styles.ValidationAlert}>
              Input should be 5-20 characters
            </p>
          )}
        </div>
        <div className={styles.FormInputWithError}>
          <input
            {...register("videoName", {
              required: true,
              minLength: 5,
              maxLength: 50,
            })}
            placeholder="Video title"
            className={styles.FormField}
          />
          {errors.videoName?.type === "required" && (
            <p className={styles.ValidationAlert}>Video title is required</p>
          )}
          {errors.videoName && (
            <p className={styles.ValidationAlert}>
              Input should be 5-20 characters
            </p>
          )}
        </div>
      </div>
      <div className={styles.FormDiv}>
        <div className={styles.FormInputWithError}>
          <input
            {...register("videoUrl", {
              required: true,
              minLength: 5,
              maxLength: 100,
            })}
            placeholder="Video link"
            className={styles.FormField}
          />
          {errors.videoUrl?.type === "required" && (
            <p className={styles.ValidationAlert}>Video link is required</p>
          )}
          {errors.videoUrl && (
            <p className={styles.ValidationAlert}>
              Input should be 5-100 characters
            </p>
          )}
        </div>
        <div className={styles.FormInputWithError}>
          <input
            {...register("questionsPerQuiz", {
              required: true,
              valueAsNumber: true,
            })}
            placeholder="No of Questions"
            className={styles.FormField}
            type="number"
          />
          {errors.questionsPerQuiz?.type === "required" && (
            <p className={styles.ValidationAlert}>
              No of questions is required
            </p>
          )}
        </div>
      </div>
      <div className={styles.FormDiv}>
        <div className={styles.FormInputWithError}>
          <input
            {...register("minMarks", {
              required: true,
              valueAsNumber: true,
              validate: (value) =>
                value <= questionsPerQuiz ||
                "Min marks should not be greater than number of questions",
            })}
            placeholder="Min marks"
            className={styles.FormField}
            type="number"
          />
          {errors.minMarks?.type === "required" && (
            <p className={styles.ValidationAlert}>Min marks is required</p>
          )}
          {errors.minMarks?.type === "validate" && (
            <p className={styles.ValidationAlert}>{errors.minMarks?.message}</p>
          )}
        </div>
        <div className={styles.FormInputWithError}>
          
          {isEditMode ? (<div className={styles.Btn}>
            <Button
              type={"button"}
              bgColor={""}
              handleClick={() => {
                navigate(`/admin/${_id}/quiz`);
              }}
            >View Quiz</Button>
            </div>
          ) : (
            <input
              {...register("questionsCSV", {
                required: true,
              })}
              type="file"
              accept=".csv"
              className={styles.CSV}
            />
          )}
          {errors.questionsCSV?.type === "required" && !isEditMode && (
            <p className={`${styles.CSVAlert} ${styles.ValidationAlert}`}>
              CSV file is required
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleFormFields;
