import { IResponses } from "../../utils/base-schema";

export const questionResponses: IResponses = {
	SERVER_ERR: {
		statusCode: 500,
		message: "QUESTION: SERVER ERR",
	},
	NOT_FOUND: {
		statusCode: 404,
		message: "QUESTION: NOT FOUND",
	},
	UPDATE_FAILED: {
		statusCode: 400,
		message: "QUESTION: UPDATE FAILED",
	},
	UPDATE_SUCCESSFUL: {
		statusCode: 400,
		message: "QUESTION: UPDATE SUCCESSFUL",
	},
	DELETE_FAILED: {
		statusCode: 400,
		message: "QUESTION: DELETE FAILED",
	},
	DELETE_SUCCESSFUL: {
		statusCode: 400,
		message: "QUESTION: DELETE SUCCESSFUL",
	},
	INSERT_FAILED: {
		statusCode: 400,
		message: "QUESTION: INSERT FAILED",
	},
	INSERT_SUCCESSFUL: {
		statusCode: 200,
		message: "QUESTION: INSERT SUCCESSFUL",
	},
};
