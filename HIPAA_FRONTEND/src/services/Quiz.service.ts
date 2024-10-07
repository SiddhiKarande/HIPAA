import { EditQuizQuestionDataService } from "../components/Admin/Quiz/QuizQuestion/QuizQuestion.types";
import { SendAnswerProps } from "../pages/Quiz/Quiz.types";
import axiosInstance from "./axiosInstance";
export const getQuizQuestions = async (
  moduleId: string,
  pageNumber: number
) => {
  try {
    const response = await axiosInstance.get(
      `/module/${moduleId}/question/${pageNumber}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const getQuizQuestionsForUser = async (moduleId: string) => {
  try {
    const response = await axiosInstance.get(
      `/module/${moduleId}/question/quizAttempt`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const handleAddMoreQuestions = async (
  formData:  { certificate: FileList },
  moduleId: string
) => {
  try {
    const response = await axiosInstance.post(
      `/module/${moduleId}/question/insertMany`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const handleEditQuestion = async (
  data: EditQuizQuestionDataService,
  moduleId: string,
  questionId: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/module/${moduleId}/question/${questionId}`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const handleDeleteQuesByAdmin = async (
  deletearray: string[],
  moduleId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/module/${moduleId}/question/`,
      {
        data: { questions: deletearray },
      }
    );
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

// filtered random questions for Learner
export const getFilteredQuestions = async () => {
  try {
    const response = await axiosInstance.get("quizquestionurl");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

//
export const searchQuestionByAPI = async (
  search: string,
  moduleId: string,
  pageNumber: number
) => {
  try {
    const response = await axiosInstance.get(
      `/module/${moduleId}/question/${pageNumber}?searchQuery=${search}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const sendAnswers = async (data: SendAnswerProps) => {
  try {
    const response = await axiosInstance.post("/quiz-attempt", data);
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
