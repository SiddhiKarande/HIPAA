import { model } from "mongoose";
import { BaseSchema } from "../utils/base-schema";

import { ModuleDocument } from "./module.types";

const questionSchema = new BaseSchema({
	question: { type: String, required: true },
	options: [{ type: String, required: true }],
	correctAns: { type: String, required: true },
});

const moduleSchema = new BaseSchema({
	name: { type: String, required: true },
	description: { type: String },
	videoUrl: { type: String, required: true },
	videoName: { type: String, required: true },
	questionsPerQuiz: { type: Number, required: true },
	minMarks: { type: Number, required: true },
	questions: [questionSchema],
	sequenceNumber: { type: Number, default: 0 },
});

moduleSchema.pre("save", async function (next) {
	if (this.isNew) {
		const highestSequenceModule = await moduleModel.findOne().sort("-sequenceNumber").exec();
		if (highestSequenceModule && highestSequenceModule.sequenceNumber !== undefined) {
			this.sequenceNumber = highestSequenceModule.sequenceNumber + 1;
		} else {
			this.sequenceNumber = 1;
		}
	}
	next();
});

export const moduleModel = model<ModuleDocument>("modules", moduleSchema);
