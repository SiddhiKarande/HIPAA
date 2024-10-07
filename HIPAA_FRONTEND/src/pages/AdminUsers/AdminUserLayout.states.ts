import { EnrolledUser } from "../EnrolledUsers/EnrolledUsers.types";

export interface AdminUserLayoutProps {
}

export interface UnEnrolledUser {
  department: string;
  designation: string;
  email: string;
  employeeId: number;
  firstName: string;
  isDeleted: boolean;
  lastName: string;
  role: string;
  _id: string;
}

export interface Nominated {
  createdAt: string;
  isDeleted: boolean;
  isEnrolled: boolean;
  targetDate: string;
  userDetails: {
    createdAt: string;
    pictureUrl: string;
    _id: string;
    role: string;
    employeeId: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    designation: string;
    isDeleted: boolean;
 
  };
  userId: string;
  _id: string;
}


export type State = {
  enrolledUsers: EnrolledUser[];
  unenrolledUsers: UnEnrolledUser[];
  nominatedUsers: Nominated[];
  loading: boolean;
  error: string | null;
  toast: { value: boolean; text: string };
  active: boolean;
  datepicker: boolean;
  selectedDate: Date | null;
  checkedState: boolean[];
  search: string;
  pagenumber: number;
  totalpages:number
};

export type Action =
  | { type: "SET_ENROLLED_USERS"; payload: EnrolledUser[] }
  | { type: "SET_UNENROLLED_USERS"; payload: UnEnrolledUser[] }
  | { type: "SET_NOMINATED_USERS"; payload: Nominated[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SHOW_TOAST"; payload: { value: boolean; text: string } }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "SET_DATEPICKER"; payload: boolean }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "SET_CHECKED_STATE"; payload: boolean[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGENUMBER"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number };
 
type GetUnEnrolledUsersFromAPI = (pagenumber: number) => Promise<void>;
type GetEnrolledUsersFromAPI = (pagenumber: number) => Promise<void>;
type GetCertifiedUsersFromAPI = (pagenumber: number) => Promise<void>;
type GetNominatedFromAPI = (pagenumber:number) => Promise<void>;
type FetchUsers = (type: string, pagenumber: number) => Promise<void>;
type SendNominatedUsers = (userIds: string[], date: Date) => Promise<void>;
type SendReNominatedUsers = (emails: string[], date: Date) => Promise<void>;
type UploadCertificate = (data:  { certificate: FileList }, userId: string) => Promise<void>;
type ReplaceCertificate = (data: { certificate: FileList }, enrollment_id: string) => Promise<void>;
type SearchUser = (search: string, type: string) => void;
export type  SetTotalPages=(pages:number)=>Promise<void>;

export interface AdminUserContextProps {
  state: State;
  getUnEnrolledUsersFromAPI: GetUnEnrolledUsersFromAPI;
  getEnrolledUsersFromAPI: GetEnrolledUsersFromAPI;
  getCertifiedUsersFromAPI: GetCertifiedUsersFromAPI;
  getNominatedFromAPI: GetNominatedFromAPI;
  fetchUsers: FetchUsers;
  sendNominatedUsers: SendNominatedUsers;
  sendReNominatedUsers: SendReNominatedUsers;
  uploadCertificate: UploadCertificate;
  replaceCertificate: ReplaceCertificate;
  searchUser: SearchUser;
  setActive: (active: boolean) => void;
  setDatepicker: (datepicker: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setCheckedState: (checkedState: boolean[]) => void;
  setSearch: (search: string) => void;
  setPageNumber: (pagenumber: number) => void;
  setTotalPages:(pages:number)=>void;
}

