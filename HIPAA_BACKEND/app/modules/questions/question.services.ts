import { Types } from "mongoose";

import { IQuestion } from "./question.types";
import { questionResponses } from "./question.responses";

import { IPaginationSearchQueries } from "../../utils/base-schema";

import moduleServices from "../module.services";
import { moduleResponses } from "../module.responses";
import { convertCsvToJson } from "../../utils/csv-to-json";

const findByModuleId = async (moduleId: string, queryObject: IPaginationSearchQueries = {}) => {
	try {
		const questions = await moduleServices.findQuestionsByModuleId(moduleId, queryObject);
		if (!questions) throw questionResponses.NOT_FOUND;
		return questions;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const findById = async (questionId: string) => {
	try {
		const question = await moduleServices.findQuestionById(new Types.ObjectId(questionId));
		return question;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const getQuestionsForQuizAttempt = async (moduleId: string) => {
	try {
		const module = await moduleServices.findOneById(moduleId);

		let questions = module[0].questions.sort(() => Math.random() - 0.5);
		questions = questions.slice(0, module[0].questionsPerQuiz);

		return questions;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const insertOne = async (moduleId: string, questionData: IQuestion) => {
	try {
		const result = await moduleServices.insertOneQuestion(new Types.ObjectId(moduleId), questionData);
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const insertMany = async (moduleId: string, questionDataCSVPath: string) => {
	try {
		const questionsData = convertCsvToJson(questionDataCSVPath);
		const result = await moduleServices.insertManyQuestion(new Types.ObjectId(moduleId), questionsData);
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw moduleResponses.SERVER_ERR;
	}
};

const updateOne = async (moduleId: string, questionId: string, questionData: Partial<IQuestion>) => {
	try {
		const result = await moduleServices.updateOneQuestion(
			new Types.ObjectId(moduleId),
			new Types.ObjectId(questionId),
			questionData
		);
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const deleteOne = async (moduleId: string, questionId: string) => {
	try {
		const result = await updateOne(moduleId, questionId, { isDeleted: true });
		if (!result) throw questionResponses.DELETE_FAILED;
		return questionResponses.DELETE_SUCCESSFUL;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw questionResponses.SERVER_ERR;
	}
};

const deleteMany = async (moduleId: string, questionIds: string[]) => {
	try {
		const result = await moduleServices.deleteManyQuestions(new Types.ObjectId(moduleId), questionIds);
		return result;
	} catch (error: any) {
		if (error.statusCode) throw error;
		console.error("Delete Many Error:", error);
		throw questionResponses.SERVER_ERR;
	}
};

export default {
	findByModuleId,
	findById,
	getQuestionsForQuizAttempt,
	insertOne,
	insertMany,
	updateOne,
	deleteOne,
	deleteMany,
};
