import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validator =
	<T extends ZodRawShape>(source: "body" | "params" | "query", schema: ZodObject<T>, passthrough: boolean) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			if (passthrough) {
				req[source] = schema.passthrough().parse(req[source]);
			} else {
				req[source] = schema.parse(req[source]);
			}
			next();
		} catch (e) {
			next({ statusCode: 400, message: "BAD REQUEST", errors: e });
		}
	};

export const body = (schema: ZodObject<ZodRawShape>, passthrough: boolean = false) =>
	validator("body", schema, passthrough);
export const params = (schema: ZodObject<ZodRawShape>, passthrough: boolean = false) =>
	validator("params", schema, passthrough);
export const query = (schema: ZodObject<ZodRawShape>, passthrough: boolean = false) =>
	validator("query", schema, passthrough);
