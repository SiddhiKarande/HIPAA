import { CertifiedState } from "./Certified.state";

export interface CertifiedUser {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      designation: string;
      department: string;
      _id:string;
    } | null;
    completionDate: string | null;
    status: string;
    progress: number;
}

export interface CertifiedContextType {
  state: CertifiedState;
  getCertifiedUsersFromAPI: (pagenumber: number) => Promise<void>;
  searchUser: (search: string, pagenumber: number) => Promise<void>;
  setActive: (active: boolean) => void;
  setDatepicker: (datepicker: boolean) => void;
  setSelectedDate: (date: Date | null) => void;
  setCheckedState: (checkedState: boolean[]) => void;
  setSearch: (search: string) => void;
  setPageNumber: (pagenumber: number) => void;
  setReNominatedUsers: (renominatedUsers: string[]) => void;
  addToReNominated: (userid: string, isChecked: boolean) => void;
  replaceCertificate: (data: { certificate: FileList }, enrollment_id: string) => Promise<void>;
  sendReNominatedUsers: (userIds: string[], date: Date) => Promise<void>;
}