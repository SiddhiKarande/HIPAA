import { CourseStatusType } from "../pages/UserProfile/UserProfile.types";
import axiosInstance from "./axiosInstance";

export const getUsers = async (
  status: CourseStatusType,
  pagenumber: number
) => {
  try {
    const response = await axiosInstance.get(
      `/user/${pagenumber}?status=${status}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};


export const searchUserByAPI = async (
  searchText: string,
  type: string,
  pagenumber: number
) => {
  try {
    let response;
    if (type === "Nominated") {
  
      response = await axiosInstance.get(
        `api/nomination/${pagenumber}?searchQuery=${searchText}`
      );
      
      return response.data.data;
    } else {
      response = await axiosInstance.get(
        `user/${pagenumber}?status=${type.toLowerCase()}&searchQuery=${searchText}`
      );
      return response.data.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const postNominateUsers = async (
  userIdWithDate: { userId: string; targetDate: Date }[]
) => {
  try {
    const data = {
      userNominations: userIdWithDate,
    };
    const response = await axiosInstance.post(
      `/api/nomination/nominate-users`,
      data
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const postReNominateUsers = async (
  userIdWithDate: { userId: string; targetDate: Date }[]
) => {
  console.log(userIdWithDate);
  try {
    const data = {
      userNominations: userIdWithDate,
    };
    console.log(data);
    const response = await axiosInstance.post(
      `/api/nomination/renominate-users`,
      data
    );
    console.log(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const uploadCertificateforUser = async (
  data: { certificate: FileList },
  enrollentId: string
) => {
  try {
    const response = await axiosInstance.post(
      `/api/enrol/upload-certificate/${enrollentId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
export const replaceCertificateforUser = async (
  certificate: { certificate: FileList },
  enrollment_id: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/enrol/edit-certificate/${enrollment_id}`,
      certificate,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
export const getAllNominations = async (pagenumber: number) => {
  try {
    const response = await axiosInstance.get(`/api/nomination/${pagenumber}`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const getEnrollmentData = async () => {
  try {
    const response = await axiosInstance.get(`/api/enrol/getEnrollments`);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const getUserLoginDataFromToken = async () => {
  try {
    const response = await axiosInstance.get(`/user/stats`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const getUserProfileDataFromToken = async () => {
  try {
    const response = await axiosInstance.get(`/user/me`);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const isModuleCompleted = async (moduleId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(
      `/api/enrol/check-module-completion/${moduleId}`
    );
    return response.data.data.isCompleted;
  } catch (error) {
    throw error;
  }
};

export const getMaxQuizScore = async (moduleId: string) => {
  try {
    const response = await axiosInstance.get(`quiz-attempt/${moduleId}`);
    return response.data.data.highestScoreAttempt;
  } catch (error) {
    throw error;
  }
};
