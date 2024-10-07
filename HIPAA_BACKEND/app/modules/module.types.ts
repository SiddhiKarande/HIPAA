import z from "zod";
import { Document, Types } from "mongoose";
import { ZBase } from "../utils/base-schema";

import { ZQuestion } from "./questions/question.types";

export const ZModule = ZBase.extend({
	name: z.string(),
	description: z.string().optional(),
	videoUrl: z.string().url(),
	videoName: z.string(),
	questionsPerQuiz: z.number(),
	questions: z.array(ZQuestion).optional(),
	minMarks: z.number(),
	sequenceNumber: z.number().optional(),
});

export interface IModule extends z.infer<typeof ZModule> {
	_id?: Types.ObjectId;
}
export type ModuleDocument = Document & IModule;
