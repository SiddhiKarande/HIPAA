import { model, Types } from "mongoose";
import { EnrollmentDocument } from "./enrollment.types";
import { BaseSchema } from "../utils/base-schema";
import { IUser } from "../users/user.types";

const enrollmentSchema = new BaseSchema({
  userId: { type: Types.ObjectId, ref: "users" },
  email: { type: String, ref: "users"},
  completionDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ["enrolled", "completed"],
    default: "enrolled",
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  certificateUrl: { type: String, default: null },
  certificationValidTill: { type: Date, default: null }, //implement +1 year
  nominationId: { type: String, ref: "nominations", default: null },
  completedModules: [{ type: Types.ObjectId, ref: "modules" }],
});

export const enrollmentModel = model<EnrollmentDocument>(
  "enrollments",
  enrollmentSchema
);


