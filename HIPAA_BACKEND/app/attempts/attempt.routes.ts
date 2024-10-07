import { Router } from "express";
import { Route } from "../routes/routes.types";
import attemptServices from "./attempt.services";
import { ResponseHandler } from "../utils/response-handler";
import { getAllQuizAttemptValidations } from "./attempt.validations";

const router = Router();

// get a specific module quiz attempts (user)
router.get("/:moduleId", ...getAllQuizAttemptValidations, async(req, res, next) => {
    try{
        const {moduleId} = req.params;
        console.log(req.currUser);
        const quizAttempts = await attemptServices.getAllAttemptsForModule(moduleId);
        res.send(new ResponseHandler(quizAttempts));
    }catch(e){
        next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const userId = req.currUser.id;
        const { moduleId, userAnswers } = req.body;
        const response = await attemptServices.attemptQuiz(userId, { moduleId, userAnswers });
        res.send(new ResponseHandler(response));
    } catch (e) {
        next(e);
    }
});

router.post("/:moduleId", async (req, res, next) => {
    try {
        const userId = req.currUser.id;
        const { moduleId } = req.params;
        const response = await attemptServices.getAttemptsAndHighestScore(userId, moduleId);
        res.send(new ResponseHandler(response));
    } catch (e) {
        next(e);
    }
});


export default new Route("/quiz-attempt", router);