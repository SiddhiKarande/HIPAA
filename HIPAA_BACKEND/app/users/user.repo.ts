import { Types } from "mongoose";

import { userModel } from "./user.schema";

import { IUser, IUserPaginationSearchQueries } from "./user.types";

const find = async (query: Partial<IUser>) => await userModel.find({ ...query, isDeleted: false });

const findOne = async (query: Partial<IUser>) => await userModel.findOne({ ...query, isDeleted: false });

const findUnenrolledUsers = async (queryObject: IUserPaginationSearchQueries) => {
	const page = queryObject.page as number;
	const limit = queryObject.limit as number;
	const skip = (page - 1) * limit;
	const searchQuery = queryObject.searchQuery;
	const { department, designation } = queryObject.filters;

	const result = await userModel.aggregate([
		{
			$lookup: {
				from: "enrollments",
				localField: "_id",
				foreignField: "userId",
				as: "result",
			},
		},
		{
			$match: {
				$or: [{ result: [] }, { result: { $elemMatch: { status: "completed" } } }],
			},
		},
		{
			$lookup: {
				from: "nominations",
				localField: "_id",
				foreignField: "userId",
				as: "nominations",
			},
		},
		{
			$match: {
				nominations: { $eq: [] },
			},
		},
		{
			$match: {
				$or: [
					{ firstName: { $regex: searchQuery, $options: "i" } },
					{ lastName: { $regex: searchQuery, $options: "i" } },
				],
			},
		},
		{
			$match: {
				department: { $regex: department, $options: "i" },
				designation: { $regex: designation, $options: "i" },
			},
		},
		{
			$facet: {
				totalCount: [{ $count: "count" }],
				data: [{ $skip: skip }, { $limit: limit }],
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

const findDistinct = async (field: string) => await userModel.distinct(field);

const findOneById = async (userId: Types.ObjectId) => await userModel.findOne({ _id: userId, isDeleted: false });

const insertOne = async (user: IUser) => await userModel.create(user);

const insertMany = async (users: IUser[]) => await userModel.insertMany(users);

const findOneAndUpdate = async (findQuery: Partial<IUser>, updateObj: Partial<IUser>) =>
	await userModel.findOneAndUpdate(findQuery, updateObj);

const findByIds = async (ids: Types.ObjectId[]) => await userModel.find({ _id: { $in: ids } });

export default {
	find,
	findOne,
	findUnenrolledUsers,
	findDistinct,
	findOneById,
	insertOne,
	insertMany,
	findOneAndUpdate,
	findByIds,
};
