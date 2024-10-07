import { z } from "zod";
import { body, params, query } from "../utils/validator";
import { ZEnrollment } from "./enrollment.types";

export const enrollUserValidations = [
  body(ZEnrollment),
];

export const getEnrollmentsWithPaginationValidations = [
  query(z.object({ page: z.string().regex(/^\d+$/) })),
];

export const uploadEditDownloadCertificateValidations = [
  params(z.object({ enrollmentId: z.string().regex(/^[0-9a-fA-F]{24}$/) })),
];

export const getCompletedModulesValidations = [
  params(z.object({ moduleId: z.string().regex(/^[0-9a-fA-F]{24}$/) })),
];

