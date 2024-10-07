import { Router } from "express";
import { Types } from "mongoose";

import { Route } from "../routes/routes.types";
import { ResponseHandler } from "../utils/response-handler";
import { permit } from "../utils/authorization";

import userServices from "./user.services";

const router = Router();

router.get("/me", async (req, res, next) => {
	try {
		const userId = req.currUser.id as string;
		const result = await userServices.getUserStats(userId, true);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/stats", async (req, res, next) => {
	try {
		const userId = req.currUser.id as string;
		const result = await userServices.getUserStats(userId, false);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/specific/:userId", async (req, res, next) => {
	try {
		const { userId } = req.params;
		const result = await userServices.getUserStats(userId, true);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/field/:field", async (req, res, next) => {
	try {
		const { field } = req.params;
		const result = await userServices.findDistinct(field);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.get("/:page/:limit?", async (req, res, next) => {
	try {
		const page = Number(req.params.page);
		const limit = Number(req.params.limit);
		const { status, searchQuery, designation, department } = req.query;
		const queryObject = {
			page,
			limit,
			searchQuery,
			filters: { designation, department },
		};
		const result = await userServices.getUsersByStatus(
			status as "unenrolled" | "enrolled" | "completed",
			queryObject
		);
		res.send(new ResponseHandler(result));
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const data = req.body;
		const insertMethod = Array.isArray(data) ? "insertMany" : "insertOne";
		const result = await userServices[insertMethod](data);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.patch("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await userServices.findOneAndUpdate({ _id: new Types.ObjectId(id) }, req.body);
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await userServices.deleteOne({ _id: new Types.ObjectId(id) });
		res.send(new ResponseHandler(result));
	} catch (e) {
		next(e);
	}
});

export default new Route("/user", router);
