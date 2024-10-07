import { attemptModel } from "./attempt.schema";

import { IAttempt } from "./attempt.types";

const find = async (query: Partial<IAttempt>) => await attemptModel.find(query);

const findOne = async (query: Partial<IAttempt>) => await attemptModel.findOne(query);

const insertOne = async (attempt: IAttempt) => await attemptModel.create(attempt);

const findOneAndUpdate = async (findQuery: Partial<IAttempt>, updateObj: Partial<IAttempt>) =>
	await attemptModel.findOneAndUpdate(findQuery, updateObj);


export default {
	find,
	findOne,
	insertOne,
	findOneAndUpdate,
};