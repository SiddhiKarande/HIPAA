import z from "zod";
import { Document } from "mongoose";
import { IPaginationSearchQueries, ZBase } from "../utils/base-schema";
import { IEnrollment } from "../enrollments/enrollment.types";

export const ZUser = ZBase.extend({
	role: z.string().optional(),
	employeeId: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	pictureUrl: z.string().nullable().default(null).optional(),
	department: z.string(),
	designation: z.string(),
});

export interface IUser extends z.infer<typeof ZUser> {}
export type UserDocument = Document & IUser;

export interface IUserPaginationSearchQueries extends IPaginationSearchQueries {
	filters: {
		department?: any;
		designation?: any;
	};
}
