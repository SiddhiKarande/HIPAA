import { Document, Types } from "mongoose";

import moduleRepo from "./module.repo";
import { convertCsvToJson } from "../utils/csv-to-json";
import { sanitizeQueryObject } from "../utils/sanitize-queries";
import { IPaginationSearchQueries } from "../utils/base-schema";

import { IModule } from "./module.types";
import { moduleResponses } from "./module.responses";

import { questionResponses } from "./questions/question.responses";
import { IQuestion } from "./questions/question.types";

const find = async (query: Partial<IModule>) => {
	const result = await moduleRepo.findAllNonDeleted({ ...query });
	return result;
};

const findOneById = async (id: string, query: Partial<IModule> = {}) => {
	try {
		const result = await moduleRepo.findOneNonDeleted(new Types.ObjectId(id), query);
		if (!result) throw moduleResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const findAllQuestionsByModuleId = async (moduleId: string) => {
	try {
		const result = await moduleRepo.findAllQuestionsByModuleId(new Types.ObjectId(moduleId as string));
		if (!result) throw questionResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const findQuestionsByModuleId = async (moduleId: String, queryObject: IPaginationSearchQueries = {}) => {
	try {
		const sanitizedQueryObject = sanitizeQueryObject(queryObject);

		const result = await moduleRepo.findQuestionsByModuleId(
			new Types.ObjectId(moduleId as string),
			sanitizedQueryObject
		);
		if (!result) throw questionResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const findQuestionById = async (questionId: Types.ObjectId) => {
	try {
		const result = await moduleRepo.findQuestionById(questionId);
		if (!result) throw questionResponses.NOT_FOUND;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const insertOne = async (data: IModule, csvFile: Express.Multer.File) => {
	try {
		const questions = convertCsvToJson(csvFile.path);

		const result = await moduleRepo.insertOne({ ...data, questions });
		if (!result) throw moduleResponses.INSERT_FAILED;
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const insertOneQuestion = async (moduleId: Types.ObjectId, questionData: IQuestion) => {
	try {
		const result = await moduleRepo.insertOneQuestion(moduleId, questionData);
		if (!result) throw questionResponses.INSERT_FAILED;
		return questionResponses.INSERT_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const insertManyQuestion = async (moduleId: Types.ObjectId, questionsData: IQuestion[]) => {
	try {
		const result = await moduleRepo.insertManyQuestion(moduleId, questionsData);
		if (!result) throw questionResponses.INSERT_FAILED;
		return questionResponses.INSERT_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const findOneAndUpdate = async (moduleId: string, updateObj: Partial<IModule & typeof Document>, options: any = {}) => {
	try {
		const result = await moduleRepo.findOneAndUpdate({ _id: new Types.ObjectId(moduleId) }, updateObj, options);
		if (!result) throw moduleResponses.UPDATE_FAILED;
		return moduleResponses.UPDATE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const updateOneQuestion = async (
	moduleId: Types.ObjectId,
	questionId: Types.ObjectId,
	questionObj: Partial<IQuestion>
) => {
	try {
		const result = await moduleRepo.updateOneQuestion(moduleId, questionId, questionObj);
		if (!result) throw questionResponses.UPDATE_FAILED;
		return questionResponses.UPDATE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const deleteOne = async (moduleId: string) => {
	try {
		const result = await moduleRepo.findOneAndUpdate({ _id: new Types.ObjectId(moduleId) }, { isDeleted: true });
		if (!result) throw moduleResponses.DELETE_FAILED;
		return moduleResponses.DELETE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const deleteManyQuestions = async (moduleId: Types.ObjectId, questionIds: string[]) => {
	try {
		const result = await moduleRepo.deleteManyQuestions(moduleId, questionIds);
		if (!result) throw questionResponses.DELETE_FAILED;
		return questionResponses.DELETE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const editModuleSequence = async (data: string[]) => {
	try {
		const modules = await find({});

		if (modules.length !== data.length) throw moduleResponses.UPDATE_FAILED;

		const bulkOperations = data.map((id, index) => ({
			updateOne: {
				filter: { _id: new Types.ObjectId(id) },
				update: { sequenceNumber: index },
			},
		}));

		const result = await moduleRepo.bulkWrite(bulkOperations);
		if (!result) throw moduleResponses.UPDATE_FAILED;
		return moduleResponses.UPDATE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

export default {
	find,
	findOneById,
	findAllQuestionsByModuleId,
	findQuestionsByModuleId,
	findQuestionById,
	insertOne,
	insertOneQuestion,
	insertManyQuestion,
	findOneAndUpdate,
	updateOneQuestion,
	deleteOne,
	editModuleSequence,
	deleteManyQuestions,
};
