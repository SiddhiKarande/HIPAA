import { NominatedState } from "./NominatedUsers.state";

export interface NominatedProps {
    createdAt: string;
    isDeleted: boolean;
    isEnrolled: boolean;
    targetDate: string;
    userDetails: {
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
  
 export interface NominatedContextProps {
    state: NominatedState;
    getNominatedUsersFromAPI: (page: number) => void;
    searchUser: (search: string, page: number) => void;
    setPageNumber: (page: number) => void;
    setSearch: (search: string) => void;
  }
  