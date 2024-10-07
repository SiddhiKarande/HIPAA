import { IResponses } from "../utils/base-schema";

export const attemptsResponses: IResponses = {
    "SOMETHING_WENT_WRONG": {
        statusCode: 500,
        message: "Error while performing quiz attempt"
    },
    "ATTEMPT_NOT_FOUND": {
        statusCode : 404,
        message: "Quiz attempt not exists/ found"
    },
    "ATTEMPTED_SUCCESSFULLY": {
        statusCode: 201,
        message: "Quiz attempted successfully"
    },
    "FAILED": {
        statusCode: 400,
        message: "Scored less marks than minimum marks"
    },
    "QUESTION_NOT_FOUND": {
        statusCode: 400,
        message: "Failed to find question details for questionId"
    },
    "BAD_REQUEST": {
        statusCode: 400,
        message: "Bad request"
    },
    "MODULE_NOT_FOUND": {
        statusCode : 404,
        message: "Module not found"
    },
}