import { IResponses } from "../utils/base-schema";

export const moduleResponses: IResponses = {
	SERVER_ERR: {
		statusCode: 500,
		message: "MODULE: SERVER ERR",
	},
	NOT_FOUND: {
		statusCode: 404,
		message: "MODULE: NOT FOUND",
	},
	UPDATE_FAILED: {
		statusCode: 400,
		message: "MODULE: UPDATE FAILED",
	},
	UPDATE_SUCCESSFUL: {
		statusCode: 200,
		message: "MODULE: UPDATE SUCCESSFUL",
	},
	DELETE_FAILED: {
		statusCode: 400,
		message: "MODULE: DELETE FAILED",
	},
	DELETE_SUCCESSFUL: {
		statusCode: 200,
		message: "MODULE: DELETE SUCCESSFUL",
	},
	INSERT_FAILED: {
		statusCode: 400,
		message: "MODULE: INSERT FAILED",
	},
};
