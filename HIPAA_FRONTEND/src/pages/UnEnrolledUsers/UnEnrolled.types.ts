import { ReactNode, createContext } from "react";
import { UnEnrolledState } from "./UnEnrolled.state";

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

export interface UnEnrolledContextType {
  state: UnEnrolledState;
  getUnEnrolledUsersFromAPI: (pagenumber: number) => Promise<void>;
  searchUser: (search: string, pagenumber: number) => Promise<void>;
  sendNominatedUsers: (userIds: string[], date: Date) => Promise<void>;
  setActive: (active: boolean) => void;
  setDatepicker: (datepicker: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setCheckedState: (checkedState: boolean[]) => void;
  setSearch: (search: string) => void;
  setPageNumber: (pagenumber: number) => void;
  setNominatedUsers: (nominatedUsers: string[]) => void;
  addToNominated: (userid: string, isChecked: boolean) => void;
}

export interface UnEnrolledContextProps {
  children: ReactNode;
}
