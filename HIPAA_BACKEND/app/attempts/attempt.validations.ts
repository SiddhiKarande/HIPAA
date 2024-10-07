import { body, params } from "../utils/validator";
import { ZAttempt } from "./attempt.types";

export const addQuizAttemptValidations = [
    body(ZAttempt)
];

export const getAllQuizAttemptValidations = [
    params(ZAttempt.pick({moduleId: true}))
];