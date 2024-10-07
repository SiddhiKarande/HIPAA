import { z } from "zod";
import { ZBase } from "../utils/base-schema";
import { Types } from "mongoose";

export const ZEnrollment = ZBase.extend({
	userId: z.instanceof(Types.ObjectId),
	email: z.string().optional(),
	completionDate: z.date().nullable().optional(),
	status: z.enum(["enrolled", "completed"]).default("enrolled"),
	progress: z.number().int().min(0).max(100).default(0),
	certificateUrl: z.string().nullable().optional(),
	certificationValidTill: z.date().nullable().optional(),
	nominationId: z.string().optional(),
	completedModules: z.array(z.instanceof(Types.ObjectId)).optional(),
});

export interface IEnrollment extends z.infer<typeof ZEnrollment> {}
export type EnrollmentDocument = Document & IEnrollment & { latestDoc: IEnrollment };
