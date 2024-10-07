import { IResponses } from "../utils/base-schema";

export const enrollmentResponses: IResponses = {
	ENROLLED_SUCCESSFULLY: {
		statusCode: 201,
		message: "User enrolled successfully",
	},
	ENROLLEMENT_UNSUCCESSFULL: {
		statusCode: 500,
		message: "User Not Enrolled",
	},
	USER_NOT_FOUND: {
		statusCode: 404,
		message: "User Not Found",
	},
	CERTIFIACTION_FAILED: {
		statusCode: 400,
		message: "Failed to update the certificate",
	},
	USER_CERTIFIED: {
		statusCode: 200,
		message: "User Certification Sucessfull",
	},
	CERTIFICATION_FAILED: {
		statusCode: 200,
		message: "User Certification Sucessfull",
	},
	MODULES_NOT_COMPLETED: {
		statusCode: 400,
		message: "Modules are incomplete",
	},
	MODULES_ALREADY_COMPLETED: {
		statusCode: 200,
		message: "Modules is alredy attempted",
	},
	USER_ALREADY_ENROLLED: {
		statusCode: 400,
		message: "User is already enrolled",
	},
	NOT_FOUND: {
		statusCode: 404,
		message: "ENROLMENT: NOT FOUND",
	},
	BAD_REQUEST: {
		statusCode: 400,
		message: "Bad Request",
	},
	SERVER_ERR: {
		statusCode: 500,
		message: "ENROLMENT: SERVER ERR",
	},
};
