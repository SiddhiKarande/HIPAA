import { EnrolledUser } from "./EnrolledUsers.types";

export interface EnrolledState {
    enrolledUsers: EnrolledUser[];
    loading: boolean;
    error: string | null;
    search: string;
    pagenumber: number;
    totalpages: number;
    active:boolean;
  }
export const initialState: EnrolledState = {
    enrolledUsers: [],
    loading: false,
    error: null,
    search: '',
    pagenumber: 1,
    totalpages: 1,
    active:false,
  };

export type EnrolledAction =
  | { type: 'SET_ENROLLED_USERS'; payload: EnrolledUser[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGENUMBER'; payload: number }
  | { type: 'SET_TOTALPAGES'; payload: number }
  | { type: 'SET_ACTIVE'; payload: boolean };

  export const EnrolledUserReducer = (state: EnrolledState, action: EnrolledAction): EnrolledState => {
    switch (action.type) {
      case 'SET_ENROLLED_USERS':
        return { ...state, enrolledUsers: action.payload, loading: false, error: null };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'SET_SEARCH':
        return { ...state, search: action.payload };
      case 'SET_PAGENUMBER':
        return { ...state, pagenumber: action.payload };
      case 'SET_TOTALPAGES':
        return { ...state, totalpages: action.payload };
        case 'SET_ACTIVE':
          return { ...state, active: action.payload };
      default:
        return state;
    }
  };
  