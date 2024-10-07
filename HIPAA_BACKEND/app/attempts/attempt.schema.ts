import { Types, model } from "mongoose";
import { BaseSchema } from "../utils/base-schema";

import { AttemptDocument } from "./attempt.types";

const attemptSchema = new BaseSchema({
    enrollmentId: {type: Types.ObjectId, ref: "enrollments"},
	userId: {type: Types.ObjectId, ref: "users"},
    moduleId: {type: Types.ObjectId, ref: "modules"},
    userAnswers: [{
        questionId: {type: Types.ObjectId, required: true, ref: "questions"},
        userAnswer: {type: String, required: true},
        isCorrect:  {type: String, default: false}
    }],
    score: {type: Number, required: true}
});

export const attemptModel = model<AttemptDocument>("attempts", attemptSchema);

export interface IUserAnswer {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }
  
