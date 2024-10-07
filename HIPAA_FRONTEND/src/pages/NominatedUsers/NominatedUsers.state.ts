import { Nominated } from "./Nominated.types";

export interface NominatedState {
  pagenumber: number;
  search: string;
  nominatedUsers: Nominated[];
  totalpages: number;
}

export const initialState: NominatedState = {
  pagenumber: 1,
  search: "",
  nominatedUsers: [],
  totalpages: 1,
};

export type NominatedAction =
  | { type: "SET_PAGE_NUMBER"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_NOMINATED_USERS"; payload: any[] }
  | { type: "SET_TOTAL_PAGES"; payload: number };

export function nominatedReducer(
  state: NominatedState,
  action: NominatedAction
): NominatedState {
  switch (action.type) {
    case "SET_PAGE_NUMBER":
      return { ...state, pagenumber: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_NOMINATED_USERS":
      return { ...state, nominatedUsers: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalpages: action.payload };
    default:
      return state;
  }
}
