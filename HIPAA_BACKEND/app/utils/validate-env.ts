import { z } from "zod";
import { config } from "dotenv";
import { IUser } from "../users/user.types";

const envObject = z.object({
	PORT: z.coerce.number(),
	JWT_SECRET: z.string(),
	MONGO_URI: z.string(),
	GOOGLE_AUTH_CLIENT_ID: z.string(),
	GOOGLE_AUTH_CLIENT_SECRET: z.string(),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.coerce.number(),
	SMTP_USERNAME: z.string(),
	SMTP_PASSWORD: z.string(),
	SMTP_SENDER: z.string()
});
type Env = z.infer<typeof envObject>;

export const validateENV = () => {
	try {
		config();
		envObject.parse(process.env);
	} catch (e) {
		throw { msg: "CONFIG ENV PROPERLY", error: e };
	}
};

declare global {
	namespace NodeJS {
		export interface ProcessEnv extends Env {}
	}

	namespace Express {
		interface Request {
			currUser: any;
		}
	}
}
