import { AdminQuizReducerState } from "./Quiz.state";

export interface QuizProps{
    questionsCSV: FileList;
}
export interface MarkedAnswerProps{
    questionId:string;
    userAnswer:string;
}

export interface SendAnswerProps {
    moduleId: string,
    userAnswers: MarkedAnswerProps[]
}
export type GetQuestions = (id: string, pageNumber: number, role: Roles) => Promise<void>;
export type SearchQuestion = (
  search: string,
  moduleId: string,
  pageNumber: number
) => Promise<void>;
export type AddMoreQuestions = (data: any, id: string) => Promise<void>;
export type HandleEdit = (
  data: any,
  questionId: string,
  moduleId: string
) => Promise<void>;
export type HandleDeleteQuestions = (
  questionIds: string[],
  moduleId: string
) => Promise<void>;
export type HandleResponse = (questionId: string, userAnswer: string) => void;
export type SendAnswerResponse = (
  moduleId: string,
  markedans: MarkedAnswerProps[]
) => Promise<string>;
export type AddToDeleted = (
  deleted: string[],
  questionId: string,
  isChecked: boolean
) => void;
export type SetOpen = (value: boolean) => void;
export type SearchQuestionName = (search: string) => void;
export type SetPageNumber=(pagenumber:number)=>void;
export type SetTotalPages=(pages:number)=>void;
export type SetSubmitMsg=(moduleId:string,markedAns:MarkedAnswerProps[])=>Promise<void>;
export type SetDeleteModal = (value: boolean) => void; 

export interface QuizContextProps {
    state: AdminQuizReducerState;
    getQuestions: GetQuestions;
    searchQuestion: SearchQuestion;
    handleEdit: HandleEdit;
    handleDeleteQuestions: HandleDeleteQuestions;
    AddMoreQuestions: AddMoreQuestions;
    handleresponse: HandleResponse;
    sendAnswerResponse: SendAnswerResponse;
    addtoDeleted: AddToDeleted;
    setOpen: SetOpen;
    searchQuestionName: SearchQuestionName;
    setPageNumber:SetPageNumber;
    setTotalPages:SetTotalPages;
    submitQuiz:SetSubmitMsg;
    setDeleteModal: SetDeleteModal;
  }
