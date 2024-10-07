import { EnrolledState } from "./EnrolledUsers.state";

export interface EnrolledUser {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      designation: string;
      department: string;
      _id:string;
    } 
    completionDate: string | null;
    status: string;
    progress: number;
  }


export interface EnrolledContextType {
    enrolledstate: EnrolledState;
    getEnrolledUsersFromAPI: (pagenumber: number) => Promise<void>;
    searchUser:(pagenumber:number)=>Promise<void>
    setSearch: (search: string) => void;
    setPageNumber: (pagenumber: number) => void;
    setActive: (active: boolean) => void;
    uploadCertificate:( data: { certificate: FileList },
      userId: string)=>Promise<void>;
  }