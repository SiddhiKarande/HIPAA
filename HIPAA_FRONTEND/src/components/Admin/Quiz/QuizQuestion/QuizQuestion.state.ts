    import {State, Action} from "./QuizQuestion.types";

    export const initialState1: State = {
        options: [],
        correctAns: ""
    }

    export const Editreducer = (state: State, action: Action): State => {
        switch(action.type) {
            case "SET_OPTIONS":
                return { ...state, options: action.value };
            case "SET_CORRECT_ANS":
                return { ...state, correctAns: action.value };
            default:
                return state;
        }
    }