import { ReactNode, createContext, useReducer } from "react";
import {
  AdminQuizAction,
  adminQuizReducer,
  initialQuesState,
} from "./Quiz.state";
import { QuizContextProps } from "./Quiz.types";
import {
  getQuizQuestions,
  getQuizQuestionsForUser,
  handleAddMoreQuestions,
  handleDeleteQuesByAdmin,
  handleEditQuestion,
  searchQuestionByAPI,
  sendAnswers,
} from "../../services/Quiz.service";
import { toast } from "react-toastify";
import { MarkedAnswerProps } from "./Quiz.types";
import { Roles } from "../../constants";
export const QuizContext = createContext<QuizContextProps | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(adminQuizReducer, initialQuesState);
  const actions = createQuizActions(dispatch);
  return (
    <QuizContext.Provider
      value={{
        state,
        ...actions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

type ComponentType = React.ComponentType<any> | undefined;
type WithQuizProviderType = (SomeComponent: ComponentType) => React.FC;
export const WithQuizProvider: WithQuizProviderType = (SomeComponent) => {
  if (!SomeComponent) {
    return () => null;
  }
  return () => (
    <QuizProvider>
      <SomeComponent />
    </QuizProvider>
  );
};

export const createQuizActions = (
  dispatch: React.Dispatch<AdminQuizAction>
) => {
  async function getQuestions(
    moduleId: string,
    pageNumber: number,
    role: string
  ) {
    dispatch({ type: "FETCH_START" });
    try {
      if (role === Roles.ADMIN) {
        const data = await getQuizQuestions(moduleId, pageNumber);
        if (data && data.questions.length > 0) {
        
          dispatch({ type: "FILTER_QUESTIONS", payload: data.questions });
          dispatch({ type: "SET_TOTAL_PAGES", payload: data.totalPages });
        } else {
          dispatch({ type: "FETCH_ERROR", payload: "No questions found" });
        }
      } else {
        const data = await getQuizQuestionsForUser(moduleId);
        if (data && data.length > 0) {
          dispatch({ type: "FETCH_SUCCESS", payload: data });
          dispatch({ type: "SET_TOTAL_PAGES", payload: 2 });
        } else {
          dispatch({ type: "FETCH_ERROR", payload: "No questions found" });
        }
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: "Error getting questions" });
      toast.error("Error fetching Quiz");
    }
  }

  const searchQuestion = async (
    search: string,
    moduleId: string,
    pageNumber: number
  ) => {
    try {
      const response = await searchQuestionByAPI(search, moduleId, pageNumber);
      dispatch({ type: "FILTER_QUESTIONS", payload: response.questions });
    } catch (e) {
      toast.error("Error Searching");
    }
  };

  async function AddMoreQuestions(data: any, id: string) {
    try {
      data.questionsCSV = data.questionsCSV[0];
      await handleAddMoreQuestions(data, id);
      getQuestions(id, 1, Roles.ADMIN);
      toast.success("CSV Uploaded succesfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  }

  async function handleEdit(data: any, questionId: string, moduleId: string) {
    const updatedQuestion = {
      _id: questionId,
      question: data.question,
      correctAns: data.correctAns,
      options: [data.option1, data.option2, data.option3, data.option4],
    };

    await handleEditQuestion(updatedQuestion, moduleId, questionId);
    dispatch({
      type: "EDIT_QUESTION",
      payload: updatedQuestion,
    });
    await getQuizQuestions(moduleId, 1);
    getQuestions(moduleId, 1, Roles.ADMIN);
    toast.success("Edited question successfully");
  }

  async function handleDeleteQuestions(
    questionIds: string[],
    moduleId: string
  ) {
    try {
      dispatch({ type: "SET_OPEN_DELETE_MODAL", payload: true });
      const response = await handleDeleteQuesByAdmin(questionIds, moduleId);
      if (response!.data.data && response!.data.data.statusCode === 400) {
        dispatch({ type: "SET_OPEN_DELETE_MODAL", payload: false });
        dispatch({
          type: "DELETE_QUESTIONS",
          payload: questionIds,
        });
        toast.success("Question deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting question");
    }
  }

  const handleresponse = (questionId: string, userAnswer: string) => {
    try {
      dispatch({
        type: "MARKED_ANSWERS",
        payload: { questionId, userAnswer },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendAnswerResponse = async (
    moduleId: string,
    markedans: MarkedAnswerProps[]
  ) => {
    try {
      const data = {
        moduleId: moduleId,
        userAnswers: markedans,
      };
      const response = await sendAnswers(data);
      if (response.statusCode === 201) {
        dispatch({ type: "LOADER_STOP" })
        return {
          status: "success",
          message: `${response.message}!!! You have submitted the quiz`,
        };
      } else {
        dispatch({ type: "LOADER_STOP" })
        return { status: "failure", message: `Uh Oh!! ${response.message}` };
      }
    } catch (error) {
      return "Some error occurred";
    }
  };

  function addtoDeleted(
    deleted: string[],
    questionId: string,
    isChecked: boolean
  ) {
    let newDeleted = [...deleted];
    if (isChecked) {
      newDeleted.push(questionId);
    } else {
      newDeleted = newDeleted.filter((id) => id !== questionId);
    }
    dispatch({ type: "SET_DELETED", payload: newDeleted });
    dispatch({ type: "SET_ACTIVE", payload: newDeleted.length > 0 });
  }

  const setOpen = (value: boolean) => {
    dispatch({ type: "SET_OPEN", payload: value });
  };
  const searchQuestionName = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  };
  const setPageNumber = (pagenumber: number) => {
    dispatch({ type: "SET_PAGE_NUMBER", payload: pagenumber });
  };
  const setTotalPages = (pages: number) => {
    dispatch({ type: "SET_TOTAL_PAGES", payload: pages });
  };

  const submitQuiz = async (
    moduleId: string,
    markedAns: MarkedAnswerProps[]
  ) => {
    dispatch({ type: "LOADER_START" });
    const response = await sendAnswerResponse(moduleId, markedAns);
    setOpen(true);
    dispatch({ type: "SUBMIT_MSG", payload: response });
  };

  const setDeleteModal = async (value: boolean) => {
    dispatch({ type: "SET_OPEN_DELETE_MODAL", payload: value });
  };

  const setDelete = async (value: boolean) => {
    if (value) {
      await handleDeleteQuestions(questionIds, moduleId);
    }
    dispatch({ type: "SET_OPEN_DELETE_MODAL", payload: false });
  };

  return {
    getQuestions,
    searchQuestion,
    handleEdit,
    handleDeleteQuestions,
    AddMoreQuestions,
    handleresponse,
    sendAnswerResponse,
    addtoDeleted,
    setOpen,
    setPageNumber,
    searchQuestionName,
    setTotalPages,
    submitQuiz,
    setDeleteModal,
  };
};
