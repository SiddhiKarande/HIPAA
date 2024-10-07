import { z } from "zod";
import { body, params, query } from "../utils/validator";
import { ZNominateUsersBody, ZPaginationAndSearchQuery } from "./nomination.types";



export const nominateUserValidations = [
    body(ZNominateUsersBody), // Validating body for nominate users
  ];
  
  export const renominateUserValidations = [
    body(ZNominateUsersBody), // Validating body for renominate users
  ];
  
  export const getNominationsWithPaginationAndSearchValidations = [
    params(z.object({ page: z.string().regex(/^\d+$/) })), // Validating page parameter
    query(ZPaginationAndSearchQuery), // Validating query parameters
  ];