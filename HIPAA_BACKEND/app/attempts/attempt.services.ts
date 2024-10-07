import { enrollmentResponses } from "../enrollments/enrollment.responses";
import enrollmentServices from "../enrollments/enrollment.services";
import { moduleResponses } from "../modules/module.responses";
import moduleServices from "../modules/module.services";
import questionServices from "../modules/questions/question.services";
import { sendMail } from "../utils/mail-service";
import attemptRepo from "./attempt.repo";
import { attemptsResponses } from "./attempt.responses";
import { IUserAnswer } from "./attempt.schema";

const getAllAttemptsForModule = async (moduleId: string) => {
	try {
		const quizAttempts = await attemptRepo.find({ moduleId });
		if (!quizAttempts) {
			throw attemptsResponses.ATTEMPT_NOT_FOUND;
		}
		return quizAttempts;
	} catch (err: any) {
		if (err.statusCode) throw err;
		throw attemptsResponses.SOMETHING_WENT_WRONG;
	}
};

const attemptQuiz = async (userId: string, data: { moduleId: string; userAnswers: IUserAnswer[] }) => {
	try {
		const { moduleId, userAnswers } = data;
		const activeEnrollment = await enrollmentServices.getActiveEnrolmentForUser(userId);
		if (!activeEnrollment) {
			throw enrollmentResponses.NOT_FOUND;
		}
		const moduleData = await moduleServices.findOneById(moduleId);
		const module = moduleData[0];

		if (!module) {
			throw attemptsResponses.MODULE_NOT_FOUND;
		}

		// Initialize score and correct answers count
		let score = 0;

		// Calculate score and correct answers
		for (const answer of userAnswers) {
			// Fetch each question by its ID
			const questionModule = await questionServices.findById(answer.questionId);
			if (!questionModule) {
				throw attemptsResponses.QUESTION_NOT_FOUND;
			}

			if (!("questions" in questionModule) || !Array.isArray(questionModule.questions)) {
				throw attemptsResponses.BAD_REQUEST;
			}

			// Extract the specific question from the module's questions array
			const questionDetails = questionModule.questions.find((q: any) => q._id.toString() === answer.questionId);
			if (!questionDetails) {
				throw attemptsResponses.QUESTION_NOT_FOUND;
			}

			const correctAns = questionDetails.correctAns;
			const isCorrect = answer.userAnswer === correctAns;
			answer.isCorrect = isCorrect;

			if (isCorrect) {
				score++;
			}
		}

		const attemptData = {
			userId,
			moduleId,
			userAnswers,
			score,
			enrollmentId: activeEnrollment._id.toString(),
		};

		const savedAttempt = await attemptRepo.insertOne(attemptData);

		// Update progress if score meets minMarks
		const minMarks = module?.minMarks || 0;
		const totalMarks: number = module.questionsPerQuiz;

		//   const userEmail = req.currUser.email;
		await sendMail({
			// to: "manav.lohani@coditas.com",
			subject: "Quiz score",
			text: `Score = ${score}`,
			html: "<h1>Some Template</h1>",
		});

		if (score >= minMarks) {
			await enrollmentServices.updateProgress(activeEnrollment._id.toString(), moduleId);
		} else {
			return { ...attemptsResponses.FAILED, score, totalMarks, minMarks };
		}

		return { ...attemptsResponses.ATTEMPTED_SUCCESSFULLY, score, totalMarks, minMarks };
	} catch (error: any) {
		if (error.statusCode) throw error;
		console.log(error);
		throw moduleResponses.SERVER_ERR;
	}
};

const getAttemptsAndHighestScore = async (userId: string, moduleId: string) => {
	try {
		const activeEnrollment = await enrollmentServices.getActiveEnrolmentForUser(userId);
		const enrollmentId = activeEnrollment!._id.toString();
		const allAttempts = await attemptRepo.find({ userId, enrollmentId, moduleId });

		if (allAttempts.length === 0) {
			throw attemptsResponses.ATTEMPT_NOT_FOUND;
		}

		const sortedAttempts = allAttempts.sort(
			(firstAttempt, secondAttempt) => secondAttempt.score - firstAttempt.score
		);
		const highestScoreAttempt = sortedAttempts[0];

		return { highestScoreAttempt };
	} catch (error) {
		throw attemptsResponses.BAD_REQUEST;
	}
};

export default { getAllAttemptsForModule, attemptQuiz, getAttemptsAndHighestScore };
