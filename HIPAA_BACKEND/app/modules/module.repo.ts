import { Document, FilterQuery, ProjectionType, Types } from "mongoose";

import { IPaginationSearchQueries } from "../utils/base-schema";

import { moduleModel } from "./module.schema";

import { IModule } from "./module.types";
import { IQuestion } from "./questions/question.types";

const find = async (query: Partial<IModule>, projection: any = {}) => await moduleModel.find(query, projection);

const findAllNonDeleted = async (query: Partial<IModule>) => {
	const pipeline = [
		{
			$match: {
				isDeleted: false,
				...query,
			},
		},
		{
			$addFields: {
				questions: {
					$filter: {
						input: "$questions",
						as: "question",
						cond: { $eq: ["$$question.isDeleted", false] },
					},
				},
			},
		},
	];

	const result = await moduleModel.aggregate(pipeline);
	return result;
};

const findOne = async (query: Partial<IModule & typeof Document & { [key: string]: any }>, projection: any = {}) =>
	await moduleModel.find(query, projection);

const findOneNonDeleted = async (moduleId: Types.ObjectId, query: Partial<IModule> = {}) => {
	const pipeline = [
		{
			$match: {
				_id: moduleId,
				isDeleted: false,
				...query,
			},
		},
		{
			$addFields: {
				questions: {
					$filter: {
						input: "$questions",
						as: "question",
						cond: { $eq: ["$$question.isDeleted", false] },
					},
				},
			},
		},
	];

	const result = await moduleModel.aggregate(pipeline);
	return result;
};

const findAllQuestionsByModuleId = async (moduleId: Types.ObjectId) => {
	const result = await moduleModel.aggregate([
		{
			$match: { _id: moduleId },
		},
		{
			$unwind: "$questions",
		},
		{
			$match: { "questions.isDeleted": false },
		},
		{
			$replaceRoot: { newRoot: "$questions" },
		},
	]);

	return result;
};

const findQuestionsByModuleId = async (moduleId: Types.ObjectId, queryObject: IPaginationSearchQueries) => {
	const page = queryObject.page as number;
	const limit = queryObject.limit as number;
	const skip = (page - 1) * limit;
	const searchQuery = queryObject.searchQuery;

	const result = await moduleModel.aggregate([
		{
			$match: {
				_id: moduleId,
			},
		},
		{
			$unwind: "$questions",
		},
		{
			$match: {
				"questions.isDeleted": false,
				"questions.question": { $regex: searchQuery, $options: "i" },
			},
		},
		{
			$facet: {
				totalCount: [{ $count: "count" }],
				data: [
					{
						$replaceRoot: {
							newRoot: "$questions",
						},
					},
					{
						$skip: skip,
					},
					{
						$limit: limit,
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
		questions: result[0].data,
		docsOnCurrPage: result[0].data.length,
		totalDocuments,
		totalPages,
		currentPage: page,
	};
};

const findQuestionById = async (questionId: Types.ObjectId) => {
	const result = (await moduleModel.findOne({ "questions._id": questionId }, { "questions.$": 1 })) as IQuestion;
	return result;
};

const insertOne = async (module: IModule) => {
	return await moduleModel.create(module);
};

const insertOneQuestion = async (moduleId: Types.ObjectId, questionData: IQuestion) => {
	const result = await moduleModel.findOneAndUpdate({ _id: moduleId }, { $push: { questions: questionData } });
	return result;
};

const insertManyQuestion = async (moduleId: Types.ObjectId, questionsData: IQuestion[]) => {
	const result = await moduleModel.findOneAndUpdate(
		{ _id: moduleId },
		{ $push: { questions: { $each: questionsData } } }
	);
	return result;
};

const findOneAndUpdate = async (
	findQuery: Partial<IModule>,
	updateObj: Partial<IModule & typeof Document>,
	options: any = {}
) => await moduleModel.findOneAndUpdate(findQuery, updateObj, options);

const updateOneQuestion = async (
	moduleId: Types.ObjectId,
	questionId: Types.ObjectId,
	questionObj: Partial<IQuestion>
) => {
	const result = await moduleModel.findOneAndUpdate(
		{ _id: new Types.ObjectId(moduleId), "questions._id": questionId },
		{
			$set: {
				"questions.$.question": questionObj.question,
				"questions.$.options": questionObj.options,
				"questions.$.correctAns": questionObj.correctAns,
				"questions.$.isDeleted": questionObj.isDeleted,
				"questions.$.updatedAt": questionObj.updatedAt,
			},
		}
	);
	return result;
};

const deleteManyQuestions = async (moduleId: Types.ObjectId, questionIds: string[]) => {
	const result = await moduleModel.findOneAndUpdate(
		{ _id: new Types.ObjectId(moduleId) },
		{ $set: { "questions.$[elem].isDeleted": true } },
		{
			arrayFilters: [{ "elem._id": { $in: questionIds } }],
			new: true,
			runValidators: true,
		}
	);
	return result;
};

const bulkWrite = async (operations: any[]) => await moduleModel.bulkWrite(operations);

export default {
	find,
	findAllNonDeleted,
	findOne,
	findOneNonDeleted,
	findAllQuestionsByModuleId,
	findQuestionsByModuleId,
	findQuestionById,
	insertOne,
	insertOneQuestion,
	insertManyQuestion,
	findOneAndUpdate,
	updateOneQuestion,
	deleteManyQuestions,
	bulkWrite,
};
