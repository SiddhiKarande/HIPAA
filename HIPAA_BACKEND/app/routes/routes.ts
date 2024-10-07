import { Application, json, Request, Response, NextFunction, urlencoded } from "express";
import cors from "cors";

import { excludedRoutes, routes } from "./routes.data";
import { ResponseHandler } from "../utils/response-handler";
import { validateToken } from "../utils/authorization";

export const registerMiddlewares = (app: Application) => {
	const corsOptions = {
		origin: "*",
	};
	app.use(cors(corsOptions));
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use(validateToken(excludedRoutes));

	for (let route of routes) {
		app.use(route.path, route.router);
	}

	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		res.status(err.statusCode || 500).send(new ResponseHandler(null, err));
	});
};
