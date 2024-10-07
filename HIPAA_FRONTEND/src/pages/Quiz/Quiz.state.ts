import { QuizquestionProps } from "../../components/Admin/Quiz/QuizQuestion/QuizQuestion.types";
import { MarkedAnswerProps } from "./Quiz.types";

export interface AdminQuizReducerState {
  questions: QuizquestionProps[];
  filteredQuestions: QuizquestionProps[];
  loading: boolean;
  error: string | null;
  markedAns: MarkedAnswerProps[];
  open: boolean;
  search: string;
  active: boolean;
  pageNumber: number;
  deleted: string[];
  edit: boolean;
  totalPages: number;
  submitMsg: {status: string, message: string};
}

export type AdminQuizAction =
  | { type: "FETCH_START" }
  | { type: "LOADER_START" }
  | { type: "LOADER_STOP" }
  | { type: "FETCH_SUCCESS"; payload: QuizquestionProps[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "EDIT_QUESTION"; payload: QuizquestionProps }
  | { type: "DELETE_QUESTIONS"; payload: string[] }
  | { type: "UPLOAD_MORE_QUES"; payload: QuizquestionProps[] }
  | { type: "FILTER_QUESTIONS"; payload: QuizquestionProps[] }
  | { type: "MARKED_ANSWERS"; payload: MarkedAnswerProps }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "SET_PAGE_NUMBER"; payload: number }
  | { type: "SET_DELETED"; payload: string[] }
  | { type: "SET_EDIT"; payload: boolean }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SUBMIT_MSG"; payload: {status: string, message: string} }
  | { type: "SET_OPEN_DELETE_MODAL"; payload: boolean };

export const initialQuesState: AdminQuizReducerState = {
  questions: [],
  filteredQuestions: [],
  loading: false,
  error: null,
  markedAns: [],
  open: false,
  search: "",
  active: false,
  pageNumber: 1,
  deleted: [],
  edit: false,
  totalPages: 3,
  submitMsg: {status: '', message: ''}
};

export const adminQuizReducer = (
  state: AdminQuizReducerState,
  action: AdminQuizAction
): AdminQuizReducerState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, error: null };
    case "LOADER_START":
      return { ...state, loading: true}
    case "LOADER_STOP":
      return { ...state, loading: false}
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        questions: action.payload,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "FILTER_QUESTIONS":
      return { ...state, filteredQuestions: action.payload };
    case "EDIT_QUESTION":
      const updatedQuestions = state.questions.map((question) =>
        question._id === action.payload._id ? action.payload : question
      );

      return {
        ...state,
        questions: updatedQuestions,
        filteredQuestions: updatedQuestions,
      };
    case "DELETE_QUESTIONS":
      const quesToDelete = state.questions.filter(
        (question) => !action.payload.includes(question._id)
      );
      return {
        ...state,
        questions: quesToDelete,
        filteredQuestions: quesToDelete,
      };

    case "MARKED_ANSWERS":
      const { questionId, userAnswer } = action.payload;
      const foundAns = state.markedAns.find(
        (obj) => obj.questionId === questionId
      );
      if (typeof foundAns === "undefined") {
        return {
          ...state,
          markedAns: [...state.markedAns, { questionId, userAnswer }],
        };
      } else {
        const otherAns = state.markedAns.filter(
          (obj) => obj.questionId !== questionId
        );
        return {
          ...state,
          markedAns: [...otherAns, { questionId, userAnswer }],
        };
      }
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_ACTIVE":
      return { ...state, active: action.payload };

    case "SET_DELETED":
      return { ...state, deleted: action.payload };
    case "SET_PAGE_NUMBER":
      return { ...state, pageNumber: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };

    case "SUBMIT_MSG":
      return {
        ...state,
        submitMsg: {status: action.payload.status, message: action.payload.message}
      }

    default:
      return state;
  }
};


