import { toast } from "react-toastify";
import { getUserProfileDataFromToken } from "../../services/User.service";
import { UserProfileReducerState } from "./UserProfile.types";
import { UserProfileDispatch } from "./UserProfileContext";

export type UserProfileAction =
  | { type: "SET_PROFILE_DATA"; payload: UserProfileReducerState }

export const initialState: UserProfileReducerState = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  designation: "",
  employeeId: -1,
  enrollments: [],
  pictureUrl: "",
};

export const UserProfileReducer = (
  state: UserProfileReducerState,
  action: UserProfileAction
): UserProfileReducerState => {
  switch (action.type) {
    case "SET_PROFILE_DATA":
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        department: action.payload.department,
        designation: action.payload.designation,
        employeeId: action.payload.employeeId,
        enrollments: action.payload.enrollments,
        pictureUrl: action.payload.pictureUrl
      }
    default:
      return state;
  }
};

export const createActions = (dispatch: UserProfileDispatch) => {
  async function getProfileData() {
    try {
      const response = await getUserProfileDataFromToken();
      dispatch({ type: "SET_PROFILE_DATA", payload: response });
    } catch (error) {
      toast.error("Error fetching Profile data")
    }
  }

  return {
    getProfileData
  };
};
