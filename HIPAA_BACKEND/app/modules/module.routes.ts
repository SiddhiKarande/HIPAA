import { Router } from "express";

import { Route } from "../routes/routes.types";
import { ResponseHandler } from "../utils/response-handler";
import { permit } from "../utils/authorization";
import { upload } from "../utils/file-uploader";

import moduleServices from "./module.services";

import questionRoutes from "./questions/question.routes";

const router = Router();

router.use("/:moduleId/question", questionRoutes);

router.get("/", async (req, res, next) => {
	try {
		// const query = zod.parse(req.query)
		const result = await moduleServices.find(req.query as any);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await moduleServices.findOneById(id, req.query);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.post("/editSequence", async (req, res, next) => {
	try {
		const { sequenceData } = req.body;
		const result = await moduleServices.editModuleSequence(sequenceData);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.post("/", upload.single("questionsCSV"), async (req, res, next) => {
	try {
		const data = req.body;
		if (req.file) {
			const result = await moduleServices.insertOne(data, req.file);
			res.send(new ResponseHandler(result));
		}
	} catch (e) {
		next(e);
	}
});

router.patch("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await moduleServices.findOneAndUpdate(id, { ...req.body });
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.delete("/delete/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await moduleServices.deleteOne(id);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

export default new Route("/module", router);
