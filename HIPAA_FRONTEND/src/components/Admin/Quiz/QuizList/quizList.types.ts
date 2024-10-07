import { Dispatch, SetStateAction } from "react";
import { QuizquestionProps } from "../QuizQuestion/QuizQuestion.types";

export interface QuizListProps {
  questions?: QuizquestionProps[];
  handleresponse?: (questionId: string, option: string) => void;
  setDeleteModal?: Dispatch<SetStateAction<boolean>>;
}
