import { useContext } from "react";
import QuizQuestion from "../QuizQuestion/QuizQuestion";
import styles from "./quizList.module.scss";
import { Roles } from "../../../../constants";
import { useAuth } from "../../../../pages/Login/authcontext";
import { QuizContext } from "../../../../pages/Quiz/QuizContext";
import { QuizListProps } from "./quizList.types.ts";
import { QuizquestionProps } from "../QuizQuestion/QuizQuestion.types.ts";
import Loader from "../../../UI components/Loader/Loader.tsx";

export default function QuizList({
  handleresponse,
}: QuizListProps) {
  const auth = useAuth();
  const { state } = useContext(QuizContext)!;
  return (
    <div className={styles.QuizList}>
      {auth.userRole === Roles.ADMIN &&
        state.filteredQuestions &&
        state.filteredQuestions.map((question: QuizquestionProps) => (
          <QuizQuestion
            key={question._id}
            _id={question._id}
            question={question.question}
            options={question.options}
            correctAns={question.correctAns}
          />
        ))}

        {auth.userRole === Roles.USER && state.loading
        && (<div className={styles.LoaderContainer}>
          <Loader/>
        </div>)}

      {auth.userRole === Roles.USER &&

        state.questions!.map((question: QuizquestionProps) => (
          <QuizQuestion
            key={question._id}
            _id={question._id}
            question={question.question}
            options={question.options}
            handleresponse={handleresponse}
          />
        ))}
    </div>
  );
}
