import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { sign } from "jsonwebtoken";

import { authResponses } from "./auth.responses";

import userServices from "../users/user.services";

const verifyGoogleCredentials = async (accessToken: string) => {
	try {
		const { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET } = process.env;
		const client = new OAuth2Client(GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET);
		const tokenInfo = await client.verifyIdToken({
			idToken: accessToken,
			audience: GOOGLE_AUTH_CLIENT_ID,
		});
		const profile: any = tokenInfo.getPayload();
		if (!profile) throw authResponses.UNAUTHORIZED;

		const { email, picture: pictureUrl } = profile;
		if (!email || !pictureUrl) throw authResponses.LOGIN_FAILED;

		const userData = await userServices.findOneAndUpdate({ email }, { pictureUrl });
		if (!userData) throw authResponses.NOT_FOUND;

		const { JWT_SECRET } = process.env;
		const token = sign({ id: userData._id, email: userData.email, role: userData.role }, JWT_SECRET || "");
		return { token, role: userData.role };
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw authResponses.SERVER_ERR;
	}
};

export default {
	verifyGoogleCredentials,
};
