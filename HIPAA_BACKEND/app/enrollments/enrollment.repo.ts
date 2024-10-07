import { Types } from "mongoose";
import { enrollmentModel } from "./enrollment.schema";
import { EnrollmentDocument, IEnrollment } from "./enrollment.types";
import { IUserPaginationSearchQueries } from "../users/user.types";

const findOne = async (query: Partial<IEnrollment>) => await enrollmentModel.findOne(query);

const findEnrolledUserIds = async () => await enrollmentModel.distinct("userId");

const findEnrolledUsers = async (queryObject: IUserPaginationSearchQueries) => {
	const page = queryObject.page as number;
	const limit = queryObject.limit as number;
	const skip = (page - 1) * limit;
	const searchQuery = queryObject.searchQuery;
	const { department, designation } = queryObject.filters;

	const result = await enrollmentModel.aggregate([
		{
			$match: {
				status: "enrolled",
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$match: {
				$or: [
					{ "user.firstName": { $regex: searchQuery, $options: "i" } },
					{ "user.lastName": { $regex: searchQuery, $options: "i" } },
				],
			},
		},
		{
			$match: {
				"user.department": { $regex: department, $options: "i" },
				"user.designation": { $regex: designation, $options: "i" },
			},
		},
		{
			$facet: {
				totalCount: [{ $count: "count" }],
				data: [
					{ $skip: skip },
					{ $limit: limit },
					{
						$project: {
							_id: 1,
							userId: "$user",
							completionDate: 1,
							status: 1,
							progress: 1,
							certificateUrl: 1,
							certificationValidTill: 1,
							nominationId: 1,
							completedModules: 1,
							isDeleted: 1,
							createdAt: 1,
							updatedAt: 1,
							__v: 1,
						},
					},
				],
			},
		},
		{
			$project: {
				data: 1,
				totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
			},
		},
	]);

	const totalDocuments = result[0].totalCount || 0;
	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		users: result[0].data,
		docsOnCurrPage: result[0].data.length,
		totalDocuments,
		totalPages,
		currentPage: page,
	};
};

const findCompletedUsers = async (queryObject: IUserPaginationSearchQueries) => {
	const page = queryObject.page as number;
	const limit = queryObject.limit as number;
	const skip = (page - 1) * limit;
	const searchQuery = queryObject.searchQuery;
	const { department, designation } = queryObject.filters;

	const result = await enrollmentModel.aggregate([
		{
			$match: {
				status: "completed",
			},
		},
		{
			$sort: {
				completionDate: -1,
			},
		},
		{
			$group: {
				_id: "$userId",
				latestDoc: { $first: "$$ROOT" },
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$addFields: {
				"latestDoc.userId": "$user",
			},
		},
		{
			$replaceRoot: {
				newRoot: "$latestDoc",
			},
		},
		{
			$facet: {
				totalCount: [
					{
						$match: {
							$or: [
								{ "userId.firstName": { $regex: searchQuery, $options: "i" } },
								{ "userId.lastName": { $regex: searchQuery, $options: "i" } },
							],
							"userId.department": { $regex: department, $options: "i" },
							"userId.designation": { $regex: designation, $options: "i" },
						},
					},
					{ $count: "count" },
				],
				data: [
					{
						$match: {
							$or: [
								{ "userId.firstName": { $regex: searchQuery, $options: "i" } },
								{ "userId.lastName": { $regex: searchQuery, $options: "i" } },
							],
							"userId.department": { $regex: department, $options: "i" },
							"userId.designation": { $regex: designation, $options: "i" },
						},
					},
					{ $skip: skip },
					{ $limit: limit },
				],
			},
		},
		{
			$project: {
				data: 1,
				totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
			},
		},
	]);

	const totalDocuments = result[0].totalCount || 0;
	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		users: result[0].data,
		docsOnCurrPage: result[0].data.length,
		totalDocuments,
		totalPages,
		currentPage: page,
	};
};

const insertOne = async (enrollment: Partial<IEnrollment>) => await enrollmentModel.create(enrollment);

const find = async (query: Partial<IEnrollment>) => await enrollmentModel.find(query);

// Function to find and populate fields(user)
const findWithPopulate = async (query: Partial<IEnrollment>, populateFields: string[]) =>
	await enrollmentModel.find(query).populate(populateFields.join(" "));

const findOneAndUpdate = async (query: Partial<IEnrollment>, update: Partial<IEnrollment>) =>
	await enrollmentModel.findOneAndUpdate(query, update, { new: true });

const findLatestEnrollmentByUserId = async (query: Partial<IEnrollment>) => {
	return await enrollmentModel.find(query).sort({ createdAt: -1 });
};

const updateProgress = async (enrollmentId: string, moduleId: string) =>
	await enrollmentModel.findOneAndUpdate(
		{ _id: new Types.ObjectId(enrollmentId), moduleId: new Types.ObjectId(moduleId) },
		{ $push: { completedModules: new Types.ObjectId(moduleId) } },
		{ new: true }
	);

export default {
	findOne,
	findEnrolledUserIds,
	findEnrolledUsers,
	findCompletedUsers,
	insertOne,
	find,
	findWithPopulate,
	findOneAndUpdate,
	findLatestEnrollmentByUserId,
	updateProgress,
};
