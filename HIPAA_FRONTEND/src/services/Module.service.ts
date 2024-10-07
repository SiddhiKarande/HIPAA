import { AddModuleInputs } from "../components/Admin/Course/AddModule/AddModule.types";
import { EditModuleInputs } from "../components/Admin/Course/EditModule/EditModule.types";
import axiosInstance from "./axiosInstance";

export const postAddModule = async (data: AddModuleInputs) => {
  try {
    const response = await axiosInstance.post("/module", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
export const getModuleData = async () => {
  try {
    const response = await axiosInstance.get("/module");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
export const postEditModule = async (data: EditModuleInputs, id: string) => {
  try {
    const response = await axiosInstance.patch(
      `/module/${id}`,
      {
        minMarks: `${data.minMarks}`,
        name: `${data.name}`,
        questionsPerQuiz: `${data.questionsPerQuiz}`,
        videoName: `${data.videoName}`,
        videoUrl: `${data.videoUrl}`,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const handleDeleteModuleService = async (moduleid: string) => {
  try {
    const response = await axiosInstance.delete(`/module/delete/${moduleid}`);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const sendSavedModuleSequence = async (sequenceArray: string[]) => {
  try {
    console.log(sequenceArray);
    const response = await axiosInstance.post(
      "/module/editSequence",
      { sequenceData: sequenceArray }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const enrollUserOnCLick = async () => {
  try {
    const response = await axiosInstance.post("/api/enrol");
    return response.status;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const checkCompletionStatus = async (
  moduleId: string
): Promise<boolean> => {
  try {
    const data = await axiosInstance.get(`/api/enrol/completed-modules`);
    if (data.data.data.includes(moduleId)) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};