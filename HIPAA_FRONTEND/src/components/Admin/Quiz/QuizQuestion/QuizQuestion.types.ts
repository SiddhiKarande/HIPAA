import { Dispatch, SetStateAction } from "react";

export interface EditQuizQuestionData {
    correctAns: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    optionbtn: null | string;
    question: string;
  }

  export interface EditQuizQuestionDataService {
    correctAns: string;
    options: string[];
    question: string;
    _id: string;
  }
  

export interface QuizquestionProps{
    _id:string,
    question:string,
    options:string[],
    correctAns?:string,
    setMarkedAns?: Dispatch<SetStateAction<Response[]>>;
    handleresponse?:(questionId:string,option:string)=>void;
}
export interface State {
    options: string[];
    correctAns: string
}

export type Action = 
| { type: "SET_OPTIONS"; value: string[] }
| { type: "SET_CORRECT_ANS"; value: string };

