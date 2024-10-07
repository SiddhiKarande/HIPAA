import { IResponses } from "../utils/base-schema";

export const nominationResponses: IResponses = {
    SERVER_ERR: {
		statusCode: 500,
		message: "NOMINATION: SERVER ERR",
	},
    "USER_NOT_FOUND": {
        statusCode : 404,
        message: "User not found"
    },
    "USER_ALREADY_NOMINATED": {
        statusCode: 400,
        message: "User already nominated"
    },
    "USER_NOMINATED_SUCCESSFULLY": {
        statusCode: 201,
        message: "User nominated successfully"
    },
    "USER_NOT_ELIGIBLE_FOR_RENOMINATION": {
        statusCode: 400,
        message: "User Is Already Nominated And Can Not Be Renominated and status is not completed"
    },
    "USER_ALREADY_ENROLLED":{
        statusCode:400,
        message:"User Is Enrolled In The Course"
    },
    "NOT_FOUND":{
        statusCode:404,
        message:"Nominations Not Found"
    }
}