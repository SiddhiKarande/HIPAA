import mongoose, { Types, model } from "mongoose";
import { BaseSchema } from "../utils/base-schema";
import { NominationDocument } from "./nomination.types";
import { boolean } from "zod";

const nominationSchema = new BaseSchema({
  userId: { type:Types.ObjectId, ref: "users", required: true },
  targetDate: { type: Date },
  isEnrolled: {type: Boolean, default:false}
});

export const nominationModel = model<NominationDocument>(
  "nominations",
  nominationSchema
);
