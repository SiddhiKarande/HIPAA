import { query } from "express";
import moduleServices from "../modules/module.services";
import nominationServices from "../nominations/nomination.services";
import userServices from "../users/user.services";
import enrollmentRepo from "./enrollment.repo";
import { enrollmentResponses } from "./enrollment.responses";
import { IEnrollment } from "./enrollment.types";
import { Types } from "mongoose";
import path from "path";
import { verify } from "jsonwebtoken";
import { string } from "zod";
// import { EnrollmentStatus } from "./enrollment.schema";
import nominationRepo from "../nominations/nomination.repo";
import { IUserPaginationSearchQueries } from "../users/user.types";
import { moduleResponses } from "../modules/module.responses";

const getEnrollments = async (query: Partial<IEnrollment>) =>
  await enrollmentRepo.find(query);

const findOneAndUpdate = async (
  findQuery: Partial<IEnrollment>,
  updateObj: Partial<IEnrollment>
) => {
  try {
    const result = await enrollmentRepo.findOneAndUpdate(findQuery, updateObj);
    return enrollmentResponses.UPDATE_SUCCESSFUL;
  } catch (error: any) {
    if (error.statusCode) throw enrollmentResponses.UPDATE_FAILED;
    throw enrollmentResponses.SERVER_ERR;
  }
};

const findWithPopulate = async (
  query: Partial<IEnrollment>,
  populateFields: string[]
) => await enrollmentRepo.findWithPopulate(query, populateFields);

export const handleCertificate = async (
  enrollmentId: string,
  certificateUrl: string,
  action: "upload" | "edit"
) => {
  try {
    const enrollment = await enrollmentRepo.findOne({
      _id: new Types.ObjectId(enrollmentId),
    });

    if (!enrollment) {
      throw enrollmentResponses.USER_NOT_FOUND;
    }

    if (action === "upload") {
      const progress = enrollment.progress;

      if (progress !== 100) {
        throw enrollmentResponses.MODULES_NOT_COMPLETED;
      }
    }

    let certificateObj: Partial<typeof enrollment> = {};

    if (action === "upload") {
      const certificationValidTill = new Date();
      certificationValidTill.setFullYear(
        certificationValidTill.getFullYear() + 1
      );
      certificateObj = {
        certificateUrl,
        certificationValidTill,
        status: "completed",
        completionDate: new Date(),
      };
      const nomination = await nominationServices.findNominationByUserId(enrollment.userId.toString());
      if (nomination) {
        await nominationServices.updateNomination(
          { _id: nomination._id },
          { isDeleted: true }
        );
      }
    } else if (action === "edit") {
      certificateObj = { certificateUrl };
    }

    const updatedEnrollment = await enrollmentRepo.findOneAndUpdate(
      { _id: new Types.ObjectId(enrollmentId) },
      certificateObj
    );

    if (!updatedEnrollment) {
      throw enrollmentResponses.CERTIFIACTION_FAILED;
    }

    return enrollmentResponses.USER_CERTIFIED;
  } catch (error: any) {
    if (error.statusCode) throw error;
		throw enrollmentResponses.SERVER_ERR;
  }
};

export const getCertificate = async (enrollmentId: string) => {
  try {
    const enrollment = await enrollmentRepo.findOne({
      _id: new Types.ObjectId(enrollmentId),
    });

    if (!enrollment || !enrollment.certificateUrl) {
      throw enrollmentResponses.USER_NOT_FOUND;
    }

    const certificatePath = path.resolve(enrollment.certificateUrl);
    return certificatePath;
  } catch (error:any) {
    if (error.statusCode) throw error;
		throw enrollmentResponses.SERVER_ERR;
  }
};

const find = async (query: Partial<IEnrollment>) =>
  await enrollmentRepo.find(query);

const findOne = async (query: Partial<IEnrollment>) =>
  await enrollmentRepo.findOne(query);

const getActiveEnrolmentForUser = async (userId: string) => {
	try {
		const activeEnrolment = await findOne({
			userId: new Types.ObjectId(userId),
			isDeleted: false,
			status: "enrolled",
		});
		return activeEnrolment;
	} catch (error: any) {
		if (error.statusCode) throw error;
		throw enrollmentResponses.SERVER_ERR;
	}
};

const getUserProgress = async (enrollment: Partial<IEnrollment>) => {
  try {
    const totalModules = (await moduleServices.find({})).length;

    // Initialize completedModules if it doesn't exist
    if (!enrollment.completedModules) {
      throw enrollmentResponses.BAD_REQUEST;
    }

    const completedModulesCount = enrollment.completedModules.length;

    if (totalModules === 0) {
      return 0;
    }

    const progress = Math.round(((completedModulesCount * 100) / totalModules) * 100) / 100;
    return progress;
  } catch (error) {
    throw enrollmentResponses.BAD_REQUEST;
  }
};



const updateProgress = async (enrollmentId: string, moduleId: string) => {
  try {
    
    const enrollment = await enrollmentRepo.findOne({ _id: new Types.ObjectId(enrollmentId) });
    if (!enrollment) {
      throw enrollmentResponses.ENROLLMENT_NOT_FOUND;
    }

    // Initialize completedModules if it doesn't exist
    if (!enrollment.completedModules) {
      enrollment.completedModules = [];
    }

    const module = (await moduleServices.findOneById(moduleId))[0];
    if (!module) moduleResponses.NOT_FOUND;

    if (!enrollment.completedModules.includes(module._id)) {
      enrollment.completedModules.push(module._id);

      enrollment.progress = await getUserProgress(enrollment); 

      await enrollment.save();
    } 

    return enrollment;
  } catch (error) {
    throw enrollmentResponses.BAD_REQUEST;
  }
};


export const enrollUser = async (userId: string) => {
  try {

  
    const user = await userServices.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) {
      throw enrollmentResponses.USER_NOT_FOUND;
    }

    const existingEnrollment = await enrollmentRepo.findOne({
      userId: user._id,
      status: "enrolled",
    });

    if (existingEnrollment) {
      throw enrollmentResponses.USER_ALREADY_ENROLLED;
    }

    const existingNominations = await nominationServices.findAllNominationsByUserId(userId);
    const activeNomination = existingNominations.find(nomination => !nomination.isDeleted);

    if (activeNomination && !activeNomination.isEnrolled) {
      // Update nomination's isEnrolled to true
      await nominationServices.updateNomination(
        { _id: activeNomination._id },
        { isEnrolled: true }
      );
    }

    const enrollmentData: Partial<IEnrollment> = {
      userId: user._id,
      nominationId: activeNomination ? activeNomination._id!.toString() : undefined,
    };

    const newEnrollment = await enrollmentRepo.insertOne(enrollmentData);
    if(newEnrollment){
      return enrollmentResponses.ENROLLED_SUCCESSFULLY
    }

    return newEnrollment;
  } catch (error:any) {
        if (error.statusCode) throw error;
        throw enrollmentResponses.SERVER_ERR;
  }
};


const findEnrolledUsers = async (queryObject: IUserPaginationSearchQueries) => {
    try {
        const result = await enrollmentRepo.findEnrolledUsers(queryObject);
        if (!result) throw enrollmentResponses.NOT_FOUND;
        return result;
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw enrollmentResponses.SERVER_ERR;
    } 
}

const findCompletedUsers = async (queryObject: IUserPaginationSearchQueries) => {
    try {
        const result = await enrollmentRepo.findCompletedUsers(queryObject);
        if (!result) throw enrollmentResponses.NOT_FOUND;
        return result;
    } catch (error: any) {
        if (error.statusCode) throw error;
        throw enrollmentResponses.SERVER_ERR;
    } 
} 

const getCompletedModules = async (userId: string) => {
  try {
   
    const activeEnrollment = await enrollmentRepo.findOne({
      userId: new Types.ObjectId(userId),
      status: "enrolled",
    });
    if (!activeEnrollment) {
      throw enrollmentResponses.ENROLLMENT_NOT_FOUND;
    }

    return activeEnrollment.completedModules;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw enrollmentResponses.SERVER_ERR;
  }
};

export default {
  getUserProgress,
  enrollUser,
  findOneAndUpdate,
  findWithPopulate,
  handleCertificate,
  getCertificate,
  getEnrollments,
  find,
  findOne,
  getActiveEnrolmentForUser,
  findEnrolledUsers,
  findCompletedUsers,
  updateProgress,
  getCompletedModules,
};
