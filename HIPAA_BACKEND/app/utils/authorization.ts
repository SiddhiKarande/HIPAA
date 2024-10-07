import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { ExcludedRoutes } from "../routes/routes.types";

export const validateToken = (excludedRoutes: ExcludedRoutes) => (req: Request, res: Response, next: NextFunction) => {
	try {
		if (excludedRoutes.find((route) => route.path(req.url) && route.method === req.method)) return next();

		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw "FORBIDDEN";

		const { JWT_SECRET } = process.env;
		const payload = verify(token, JWT_SECRET || "");

		req.currUser = payload;

		next();
	} catch (e) {
		next({ statusCode: 403, message: "FORBIDDEN", err: e });
	}
};

type Role = "admin" | "supervisor" | "user";
type Roles = Role[];

export const permit = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
	if (!roles.includes(req.currUser.role)) throw `NOT AUTHORIZED TO ACCESS THIS`;

	next();
};
