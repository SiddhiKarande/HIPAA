import styles from "./quizpage.module.scss";
import { useParams } from "react-router-dom";
import { QuizContext, WithQuizProvider } from "./QuizContext";
import { useCallback, useContext, useEffect } from "react";
import { useAuth } from "../Login/authcontext";
import QuizList from "../../components/Admin/Quiz/QuizList/quizlist";
import { Roles } from "../../constants";
import Pagination from "../../components/UI components/Pagination/Pagination.tsx";
import QuizTopBar from "../../components/Admin/Quiz/QuizTopBar/QuizTopBar.tsx";
import { debounce } from "lodash";

function Quiz() {
  const { state, handleresponse, getQuestions, setPageNumber,searchQuestion } =
    useContext(QuizContext)!;

  const { moduleId } = useParams();
  const auth = useAuth();

  useEffect(() => {
    getQuestions(moduleId!, state.pageNumber, auth.userRole!);
   
  }, [auth.userRole, state.pageNumber,state.search]);

  const debouncedSearchUser = useCallback(
    debounce((search) => {
      searchQuestion(search, moduleId!, state.pageNumber);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearchUser(state.search);
  }, [state.search, debouncedSearchUser]);
  return (
    <>
      <div className={styles.QuizPage}>
        <QuizTopBar />

        {auth.userRole === Roles.ADMIN && (
          <QuizList questions={state.filteredQuestions} />
        )}

        {auth.userRole === Roles.USER && (
          <QuizList
            questions={state.questions}
            handleresponse={handleresponse}
          />
        )}
        {auth.userRole === Roles.ADMIN && (
          <Pagination
            pagenumber={state.pageNumber}
            setPageNumber={setPageNumber}
            totalPages={state.totalPages}
          />
        )}
      </div>
    </>
  );
}

export default WithQuizProvider(Quiz);
