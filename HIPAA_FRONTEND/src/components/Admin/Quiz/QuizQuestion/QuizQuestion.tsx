import { useForm } from "react-hook-form";
import styles from "./quizQuestion.module.scss";
import Button from "../../../UI components/Button/button";
import { useContext, useEffect, useState} from "react";
import { useAuth } from "../../../../pages/Login/authcontext";
import { Roles } from "../../../../constants";
import { EditQuizQuestionData, QuizquestionProps } from "./QuizQuestion.types";
import { useParams } from "react-router-dom";
import { QuizContext } from "../../../../pages/Quiz/QuizContext";

export default function QuizQuestion({
  _id,
  question,
  options,
  correctAns,
  handleresponse,
}: QuizquestionProps) {
  const { moduleId } = useParams();
  const { register, handleSubmit, setValue } = useForm();
const [edit,setEdit]=useState(false);
  const auth = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const { state, handleEdit, addtoDeleted } = useContext(QuizContext)!;
  useEffect(() => {
    setValue("question", question || "");
    setValue("correctAns", correctAns || "");
    setValue("option1", options[0]);
    setValue("option2", options[1]);
    setValue("option3", options[2]);
    setValue("option4", options[3]);
  }, [question, correctAns, options[0], options[1], options[2], options[3]]);

  async function handleEditQuestion(data: EditQuizQuestionData) {
    if (moduleId) handleEdit(data, _id, moduleId);
    setEdit(false);
  }
  function handleCheckboxChange() {
    const newChecked = !isChecked;
    setIsChecked(newChecked)
    if (addtoDeleted) {
      addtoDeleted(state.deleted, _id, newChecked);
    }
  }
  return (
    <>
      <form
        className={styles.QuizQuestion}
        onSubmit={handleSubmit(handleEditQuestion)}
      >
        {!edit && <h2>{question}</h2>}
        {edit && <input {...register("question")} />}

        <div className={styles.QuestionOption}>
          {options.map((option, i) => (
            <div className={styles.InputEach} key={i}>
              <input
                {...register(`optionbtn`)}
                type="radio"
                name="option"
                onClick={() => handleresponse!(_id, option)}
              />
              {!edit && <label htmlFor="option">{option}</label>}
              {edit && <input {...register(`option${i + 1}`)} />}
            </div>
          ))}
          {auth.userRole === Roles.ADMIN && (
            <>
              <div className={styles.InputEach}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label>Select</label>{" "}
              </div>
              {!edit && <h4>Correct Answer: {correctAns}</h4>}
              {edit && <select {...register("correctAns")} >
              {options.map((option, i) => (
                <option>{option}</option>
              ))}
                </select>}
              {!edit && (
                <Button
                  type={"button"}
                  bgColor={""}
                  handleClick={() => setEdit(true)}
                >Edit</Button>
              )}
              {edit && (<>
                <Button
                  type={"submit"}
                  bgColor={""}
                  handleClick={() => {}}
                >Save</Button>
                <Button
                  type={"submit"}
                  bgColor={""}
                  handleClick={() => {setEdit(false)}}
                >X</Button></>
              )}
            </>
          )}
        </div>
      </form>
    </>
  );
}
