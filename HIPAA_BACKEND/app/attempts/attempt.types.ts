import z from "zod";
import { Document } from "mongoose";
import { ZBase } from "../utils/base-schema";

export const ZAttempt = ZBase.extend({
    enrollmentId: z.string(),
    userId: z.string(),
    moduleId: z.string(),
    userAnswers: z.array(z.object({
        questionId: z.string(),
        userAnswer: z.string(),
        isCorrect: z.boolean().default(false)
    })),
    score: z.number().default(0)
});

export interface IAttempt extends z.infer<typeof ZAttempt> {}
export type AttemptDocument = Document & IAttempt;