import { model } from "mongoose";
import { BaseSchema } from "../utils/base-schema";

import { UserDocument } from "./user.types";

const userSchema = new BaseSchema({
	role: { type: String, enum: ["admin", "user"], default: "user" },
	employeeId: { type: Number, required: true },
	firstName: { type: String, require: true },
	lastName: { type: String, require: true },
	email: { type: String, require: true, unique: true },
	pictureUrl: { type: String, default: null },
	department: { type: String, require: true },
	designation: { type: String, require: true },
});

export const userModel = model<UserDocument>("users", userSchema);
