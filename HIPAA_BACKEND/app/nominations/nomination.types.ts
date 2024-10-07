import { z } from "zod";
import { ZBase } from "../utils/base-schema";
import { Types } from "mongoose";

export const ZNomination = ZBase.extend({
    userId: z.string(),
    targetDate: z.date().optional(),
    isEnrolled: z.boolean().optional(),
  });

export  const ZUserIdParam = z.object({
    userId: z.string().length(24),
  });
  
  // Schema for nominate and renominate users request body
export  const ZNominateUsersBody = z.object({
    userNominations: z.array(
      z.object({
        userId: z.string().length(24), 
        targetDate: z.string().optional(), 
      })
    ),
  });
  
  // Schema for pagination and search query parameters
  export  const ZPaginationAndSearchQuery = z.object({
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
  });


export interface INomination extends z.infer<typeof ZNomination> {}
export type NominationDocument = Document & INomination;
