import { Types, UpdateQuery } from "mongoose";
import { nominationModel } from "./nomination.schema";
import { INomination } from "./nomination.types";
import { IPaginationSearchQueries } from "../utils/base-schema";
import { IUserPaginationSearchQueries } from "../users/user.types";

const findOne = async (query: Partial<INomination>) => await nominationModel.findOne(query);

const insertMany = async (nomination: INomination[]) => await nominationModel.insertMany(nomination);

const findAll = async (query: Partial<INomination>) => await nominationModel.find(query);

const updateOne = async (filter: Partial<INomination>, update: Partial<INomination>) => await nominationModel.updateOne(filter, update);

const findAllWithPaginationAndSearch = async (queryObject: IUserPaginationSearchQueries) => {
  const page = queryObject.page as number || 1;
  const limit = queryObject.limit as number || 10;
  const skip = (page - 1) * limit;
  const searchQuery = queryObject.searchQuery || '';
  const { department = '', designation = '' } = queryObject.filters;

  const matchStage = {
    isEnrolled: false,
    $or: [
      { "user.firstName": { $regex: searchQuery, $options: "i" } },
      { "user.lastName": { $regex: searchQuery, $options: "i" } },
    ],
    "user.department": { $regex: department, $options: "i" },
    "user.designation": { $regex: designation, $options: "i" },
  };

  const result = await nominationModel.aggregate([
    {
      $match: {
        isEnrolled: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: matchStage,
    },
    {
      $facet: {
        totalCount: [
          { $count: "count" },
        ],
        data: [
          { $skip: skip },
          { $limit: limit },
        ],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
      },
    },
  ]);

  const totalDocuments = result[0].totalCount || 0;
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    users: result[0].data,
    docsOnCurrPage: result[0].data.length,
    totalDocuments,
    totalPages,
    currentPage: page,
  };
};



export default {
  findOne, insertMany, findAll, updateOne, findAllWithPaginationAndSearch,
};
