import { Router } from "express";
import nominationServices from "./nomination.services";
import { ResponseHandler } from "../utils/response-handler";
import { getNominationsWithPaginationAndSearchValidations, nominateUserValidations, renominateUserValidations } from "./nomination.validations";
import { Route } from "../routes/routes.types";

const router = Router();

router.post("/nominate-users",...nominateUserValidations ,async (req, res, next) => {
  try {
    const { userNominations = [] } = req.body;
    const results = await nominationServices.nominateUsers(userNominations, 'nominate');
    console.log
    res.send(new ResponseHandler(results));
  } catch (error) {
    console.error("Error in /nominate-users route:", error);
    next(error);
  }
});

router.post("/renominate-users",...renominateUserValidations ,async (req, res, next) => {
  try {
    const { userNominations = [] } = req.body;
    const results = await nominationServices.nominateUsers(userNominations, 'renominate');
    console.log
    res.send(new ResponseHandler(results));
  } catch (error) {
    console.error("Error in /nominate-users route:", error);
    next(error);
  }
});

router.get("/:page/:limit?", async (req, res, next) => {
	try {
		const page = Number(req.params.page);
		const limit = Number(req.params.limit);
		const { searchQuery, designation, department } = req.query;
		const queryObject = {
			page,
			limit,
			searchQuery,
			filters: { designation, department },
		};
		const result = await nominationServices.getAllNonEnrolledNominationsWithUserDetails(queryObject);
		res.send(new ResponseHandler(result));
	} catch (error) {
		next(error);
	}
});




export default new Route("/api/nomination", router);
