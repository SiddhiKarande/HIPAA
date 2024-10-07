import { Types } from "mongoose";

import userRepo from "./user.repo";
import { sanitizeQueryObject } from "../utils/sanitize-queries";

import { IUser, IUserPaginationSearchQueries } from "./user.types";
import { userResponses } from "./user.responses";

import enrollmentServices from "../enrollments/enrollment.services";
import { enrollmentResponses } from "../enrollments/enrollment.responses";
import { IEnrollment } from "../enrollments/enrollment.types";

const find = async (query: Partial<IUser>) => await userRepo.find(query);

const findOne = async (query: Partial<IUser>) => {
	try {
		const result = await userRepo.findOne(query);
		if (!result) throw userResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const findDistinct = async (field: string) => {
	try {
		const result = await userRepo.findDistinct(field);
		if (!result) throw userResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const getUsersByStatus = async (
	status: "unenrolled" | "enrolled" | "completed",
	queryObject: IUserPaginationSearchQueries
) => {
	const sanitizedQueryObject = sanitizeQueryObject(queryObject);

	switch (status) {
		case "unenrolled":
			const unenrolledUsers = await userRepo.findUnenrolledUsers(sanitizedQueryObject);
			if (!unenrolledUsers) throw enrollmentResponses.NOT_FOUND;
			return unenrolledUsers;
		case "enrolled":
			const enrolledUsers = await enrollmentServices.findEnrolledUsers(sanitizedQueryObject);
			return enrolledUsers;
		case "completed":
			const completedUsers = await enrollmentServices.findCompletedUsers(sanitizedQueryObject);
			return completedUsers;
	}
};

const getUserStats = async (userId: string, fillEnrollments: boolean) => {
	try {
		const user = await findOne({ _id: new Types.ObjectId(userId) });
		if (!user) throw userResponses.NOT_FOUND;
		const activeEnrollment = await enrollmentServices.getActiveEnrolmentForUser(userId);

		let enrollmentsUnderUser: IEnrollment[] = [];
		if (fillEnrollments) {
			enrollmentsUnderUser = await enrollmentServices.find({ userId: user._id });
		}

		const { _id, role, employeeId, firstName, lastName, email, department, designation, pictureUrl } = user;

		return {
			_id,
			role,
			employeeId,
			firstName,
			lastName,
			email,
			department,
			designation,
			pictureUrl,
			activeEnrollment,
			...(fillEnrollments ? { enrollments: enrollmentsUnderUser } : {}),
		};
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const insertOne = async (data: IUser) => {
	try {
		const result = await userRepo.insertOne(data);
		if (!result) throw userResponses.INSERT_FAILED;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const insertMany = async (data: IUser[]) => {
	try {
		const result = await userRepo.insertMany(data);
		if (!result) throw userResponses.INSERT_FAILED;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const findOneAndUpdate = async (findQuery: Partial<IUser>, updateObj: Partial<IUser>) => {
	try {
		const result = await userRepo.findOneAndUpdate(findQuery, updateObj);
		if (!result) throw userResponses.UPDATE_FAILED;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const deleteOne = async (query: Partial<IUser>) => {
	try {
		const result = await userRepo.findOneAndUpdate(query, { isDeleted: true });
		if (!result) throw userResponses.DELETE_FAILED;
		return userResponses.DELETE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

const getUsersByIds = async (userIds: Types.ObjectId[]) => {
	try {
		const users = await userRepo.findByIds(userIds);
		if (!users) throw userResponses.USER_NOT_FOUND;
		return users;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw userResponses.SERVER_ERR;
	}
};

export default {
	find,
	findOne,
	findDistinct,
	getUsersByStatus,
	getUserStats,
	insertOne,
	insertMany,
	findOneAndUpdate,
	deleteOne,
	getUsersByIds,
};
