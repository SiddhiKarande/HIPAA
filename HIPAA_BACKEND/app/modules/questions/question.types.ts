import z from "zod";
import { Types } from "mongoose";
import { ZBase } from "../../utils/base-schema";

export const ZQuestion = ZBase.extend({
	question: z.string(),
	options: z.array(z.string()),
	correctAns: z.string(),
});

export interface IQuestion extends z.infer<typeof ZQuestion> {
	_id?: Types.ObjectId;
}
