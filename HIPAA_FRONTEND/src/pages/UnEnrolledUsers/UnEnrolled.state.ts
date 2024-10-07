import { UnEnrolledUser } from "./UnEnrolled.types";

export interface UnEnrolledState {
  unenrolledUsers: UnEnrolledUser[];
  loading: boolean;
  error: string | null;
  toast: { value: boolean; text: string };
  active: boolean;
  datepicker: boolean;
  selectedDate: Date | null;
  checkedState: boolean[];
  search: string;
  pagenumber: number;
  totalpages: number;
  nominatedUsers: string[];
}

export const initialState: UnEnrolledState = {
  unenrolledUsers: [],
  loading: true,
  error: null,
  toast: { value: false, text: "" },
  active: false,
  datepicker: false,
  selectedDate: null,
  checkedState: [],
  search: "",
  pagenumber: 1,
  totalpages: 1,
  nominatedUsers: [], 
};

export type UnEnrolledAction =
| { type: "SET_UNENROLLED_USERS"; payload: UnEnrolledUser[] }
| { type: "SET_TOTAL_PAGES"; payload: number }
| { type: "SET_ERROR"; payload: string }
| { type: "SET_ACTIVE"; payload: boolean }
| { type: "SET_DATEPICKER"; payload: boolean }
| { type: "SET_SELECTED_DATE"; payload: Date | null }
| { type: "SET_CHECKED_STATE"; payload: boolean[] }
| { type: "SET_SEARCH"; payload: string }
| { type: "SET_PAGE_NUMBER"; payload: number }
| { type: "SET_NOMINATED_USERS"; payload: string[] } 
| { type: "ADD_TO_NOMINATED"; payload: { userid: string; isChecked: boolean } }; 

export const UnEnrolledReducer = (state: UnEnrolledState, action: UnEnrolledAction): UnEnrolledState => {
  switch (action.type) {
    case "SET_UNENROLLED_USERS":
      return { ...state, unenrolledUsers: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalpages: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ACTIVE":
      return { ...state, active: action.payload };
    case "SET_DATEPICKER":
      return { ...state, datepicker: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_CHECKED_STATE":
      return { ...state, checkedState: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_PAGE_NUMBER":
      return { ...state, pagenumber: action.payload };
    case "SET_NOMINATED_USERS":
      return { ...state, nominatedUsers: action.payload };
    case "ADD_TO_NOMINATED":
      const { userid, isChecked } = action.payload;
      const updatedNominatedUsers = isChecked
        ? [...state.nominatedUsers, userid]
        : state.nominatedUsers.filter((id) => id !== userid);
      return { ...state, nominatedUsers: updatedNominatedUsers };
    default:
      return state;
  }
};
