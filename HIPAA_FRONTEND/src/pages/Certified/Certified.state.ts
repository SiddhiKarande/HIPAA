import { CertifiedUser } from "./Certified.types";

export interface CertifiedState {
  certifiedUsers: CertifiedUser[];
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
  renominatedUsers: string[];
}

export const initialState: CertifiedState = {
  certifiedUsers: [],
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
  renominatedUsers: []
};

export type CertifiedAction =
  | { type: "SET_CERTIFIED_USERS"; payload: CertifiedUser[] }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TOAST"; payload: { value: boolean; text: string } }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "SET_DATEPICKER"; payload: boolean }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "SET_CHECKED_STATE"; payload: boolean[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE_NUMBER"; payload: number }
  | { type: "SET_RENOMINATED_USERS"; payload: string[] }
  | { type: "ADD_TO_RENOMINATED"; payload: { userid: string; isChecked: boolean } };

export const CertifiedReducer = (state: CertifiedState, action: CertifiedAction): CertifiedState => {
  switch (action.type) {
    case "SET_CERTIFIED_USERS":
      return { ...state, certifiedUsers: action.payload, loading: false };
    case "SET_TOTAL_PAGES":
      return { ...state, totalpages: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_TOAST":
      return { ...state, toast: action.payload };
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
    case "SET_RENOMINATED_USERS":
      return { ...state, renominatedUsers: action.payload };
    case "ADD_TO_RENOMINATED":
      const { userid, isChecked } = action.payload;
      const updatedReNominatedUsers = isChecked
        ? [...state.renominatedUsers, userid]
        : state.renominatedUsers.filter((id) => id !== userid);
      return { ...state, renominatedUsers: updatedReNominatedUsers };
    default:
      return state;
  }
};