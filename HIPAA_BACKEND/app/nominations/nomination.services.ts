import { Types } from "mongoose";
import enrollmentRepo from "../enrollments/enrollment.repo";
import enrollmentServices from "../enrollments/enrollment.services";
import userServices from "../users/user.services";
import { IUser } from "../users/user.types";
import nominationRepo from "./nomination.repo";
import { nominationResponses } from "./nomination.responses"
import { INomination } from "./nomination.types";
import { AnyAaaaRecord } from "dns";
import { IPaginationSearchQueries } from "../utils/base-schema";
import { sanitizeQueryObject } from "../utils/sanitize-queries";

const findNominationByUserId = async (userId: string) => {
  try {
    const objectId = new Types.ObjectId(userId);

    const nomination = await nominationRepo.findOne({
      userId: objectId.toString(),
    });
    return nomination;
  } catch (error) {
    throw nominationResponses.USER_NOT_FOUND;
  }
};

const findAllNominationsByUserId = async (userId: string)=> {
  try {
    const nominations = await nominationRepo.findAll({userId});
    return nominations;
  } catch (error) {
    throw nominationResponses.NOT_FOUND;
  }
};

const nominateUsers = async (
  userNominations: { userId: string; targetDate: string }[],
  action: "nominate" | "renominate"
) => {
  try {
    if (userNominations.length === 0) {
      throw new Error("Invalid input: userNominations array cannot be empty");
    }

    const results = await Promise.all(
      userNominations.map(async ({ userId, targetDate }) => {
        try {
          // Convert userId to ObjectId
          const objectId = new Types.ObjectId(userId);
          let user;

          if (action === "nominate") {
            // Find user by userId
            user = await userServices.findOne({ _id: objectId });
            if (!user) {
              throw nominationResponses.USER_NOT_FOUND;
            }

            // Check if user is already enrolled
            const userIsEnrolled = await enrollmentServices.findOne({
              userId: objectId,
              status: "enrolled",
            });
            if (userIsEnrolled) {
              throw nominationResponses.USER_ALREADY_ENROLLED;
            }

            // Check if the user is already nominated
            const existingNomination = await nominationRepo.findOne({
              userId: userId, 
              isDeleted: false,
            });
            if (existingNomination) {
              throw nominationResponses.USER_ALREADY_NOMINATED;
            }
          } else if (action === "renominate") {
            // Find user by userId in completed enrollments
            const completedEnrollment = await enrollmentServices.findOne({
              userId: objectId,
              status: "completed",
            });
            if (!completedEnrollment) {
              throw nominationResponses.USER_NOT_ELIGIBLE_FOR_RENOMINATION;
            }

             // Check if the user is actively nominated
             const activeNomination = await nominationRepo.findOne({
              userId: userId,
              isDeleted: false,
            });
            if (activeNomination) {
              throw nominationResponses.USER_ALREADY_NOMINATED;
            }

          }

          let parsedDate: Date | undefined;
          if (targetDate) {
            parsedDate = new Date(targetDate);
            if (isNaN(parsedDate.getTime())) {
              throw new Error("Invalid target date");
            }
          }

          await nominationRepo.insertMany([
            {
              userId: userId,
              targetDate: parsedDate,
              isDeleted: false, 
            } as INomination,
          ]);

          return { userId, status: "success" };
        } catch (error: any) {
          if (error.statusCode) throw error;
          console.error('Error in user nomination:', error);
          return { userId, status: "failure", reason: error.message || 'Server error' };
        }
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
};

export const getAllNonEnrolledNominationsWithUserDetails = async (
  queryObject: IPaginationSearchQueries
) => {
  try {
    const sanitizedQueryObject = sanitizeQueryObject(queryObject);
    const nominationsWithUserDetails = await nominationRepo.findAllWithPaginationAndSearch(sanitizedQueryObject);
    return nominationsWithUserDetails;
  } catch (error) {
    throw nominationResponses.NOT_FOUND;
  }
};

export const updateNomination = async (filter: Partial<INomination>, update: Partial<INomination>) => {
  try {
    const result = await nominationRepo.updateOne(filter, update);
    return result;
  } catch (error) {
    throw new Error('Failed to update nomination');
  }
};



export default {
  findNominationByUserId,
  nominateUsers,
  getAllNonEnrolledNominationsWithUserDetails,
  updateNomination,
  findAllNominationsByUserId
};
