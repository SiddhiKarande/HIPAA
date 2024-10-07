import { match } from "path-to-regexp";

import userRoutes from "../users/user.routes";
import authRoutes from "../auth/auth.routes";
import enrollmentRoutes from "../enrollments/enrollment.routes";
import nominationRoutes from "../nominations/nomination.routes";
import moduleRoutes from "../modules/module.routes";
import attemptRoutes from "../attempts/attempt.routes";

import { ExcludedRoutes, Route } from "./routes.types";

export const routes: Route[] = [
	userRoutes,
	authRoutes,
	enrollmentRoutes,
	nominationRoutes,
	moduleRoutes,
	attemptRoutes,
];

export const excludedRoutes: ExcludedRoutes = [{ path: match("/api/auth/google"), method: "POST" },
	{ path: match("/api/nomination/"), method: "GET" },
	{ path: match("/api/nomination/nominate-users"), method: "POST" },
	{ path: match("/api/enrol/download-certificate/:enrollmentId"), method: "GET" },
	{ path: match("/upload-certificate/:_id"), method: "POST" },
	
];
