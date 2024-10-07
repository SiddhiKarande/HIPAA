import { Router } from "express";

import { Route } from "../routes/routes.types";
import { ResponseHandler } from "../utils/response-handler";

import authServices from "./auth.services";

const router = Router();

router.post("/google", async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const payload = await authServices.verifyGoogleCredentials(token as string);
		res.send(new ResponseHandler(payload));
	} catch (e) {
		next(e);
	}
});

export default new Route("/api/auth", router);
