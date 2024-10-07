import { IResponses } from "../utils/base-schema";

export const authResponses: IResponses = {
	LOGIN_FAILED: {
		statusCode: 401,
		message: "AUTH: LOGIN FAILED",
	},
	NOT_FOUND: {
		statusCode: 404,
		message: "AUTH: USER NOT FOUND",
	},
	UNAUTHORIZED: {
		statusCode: 401,
		message: "AUTH: UNAUTHORIZED",
	},
	SERVER_ERR: {
		statusCode: 500,
		message: "AUTH: SERVER ERR",
	},
};
