import { Request, Router } from "express";

import { ResponseHandler } from "../../utils/response-handler";
import { permit } from "../../utils/authorization";
import { upload } from "../../utils/file-uploader";

import questionServices from "./question.services";

const router = Router({ mergeParams: true });

router.get("/quizAttempt", async (req: Request<{ moduleId: string }>, res, next) => {
	try {
		const { moduleId } = req.params;
		const result = await questionServices.getQuestionsForQuizAttempt(moduleId);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/:page/:limit?", async (req: Request<{ moduleId: string; page?: number; limit?: number }>, res, next) => {
	try {
		const { moduleId, page, limit } = req.params;
		const { searchQuery } = req.query;

		const queryObject = { page, limit, searchQuery };
		const result = await questionServices.findByModuleId(moduleId, queryObject);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/specific/:id", async (req: Request<{ id: string }>, res, next) => {
	try {
		const { id } = req.params;
		const result = await questionServices.findById(id);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.post("/", async (req: Request<{ moduleId: string }>, res, next) => {
	try {
		const { moduleId } = req.params;
		const result = await questionServices.insertOne(moduleId, { ...req.body });
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.post("/insertMany", upload.single("questionsCSV"), async (req: Request<{ moduleId: string }>, res, next) => {
	try {
		const { moduleId } = req.params;
		if (req.file) {
			const result = await questionServices.insertMany(moduleId, req.file.path);
			res.send(new ResponseHandler(result));
		}
	} catch (e) {
		next(e);
	}
});

router.patch("/:id", async (req: Request<{ moduleId: string; id: string }>, res, next) => {
	try {
		const { moduleId, id } = req.params;
		const result = await questionServices.updateOne(moduleId, id, { ...req.body });
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.delete("/:id", async (req: Request<{ moduleId: string; id: string }>, res, next) => {
	try {
		const { moduleId, id } = req.params;
		const result = await questionServices.deleteOne(moduleId, id);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.delete("/", async (req: Request<{ moduleId: string }>, res, next) => {
	try {
		const { moduleId } = req.params;
		const { questions } = req.body;
		const result = await questionServices.deleteMany(moduleId, questions);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

export default router;
