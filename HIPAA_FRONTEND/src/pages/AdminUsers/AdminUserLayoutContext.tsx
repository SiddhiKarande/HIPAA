import React, { createContext, useReducer, ReactNode } from "react";
import { toast } from "react-toastify";

import {
  getAllNominations,
  getUnenrolledUsers,
  getUsers,
  postNominateUsers,
  postReNominateUsers,
  replaceCertificateforUser,
  searchUserByAPI,
  uploadCertificateforUser,
} from "../../services/User.service";
import { Action, AdminUserContextProps, State } from "./AdminUserLayout.states";

export const initialState: State = {
  enrolledUsers: [],
  unenrolledUsers: [],
  nominatedUsers: [],
  loading: false,
  error: "",
  toast: { value: false, text: "" },
  active: false,
  datepicker: false,
  selectedDate: null,
  checkedState: [],
  search: "",
  pagenumber: 1,
  totalpages:4
};
export const UserContext = createContext<AdminUserContextProps | undefined>(
  undefined
);

export const AdminuserReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_ENROLLED_USERS":
      return {
        ...state,
        enrolledUsers: action.payload,
        nominatedUsers: [],
        unenrolledUsers: [],
        loading: false,
        error: null,
      };
    case "SET_UNENROLLED_USERS":
      return {
        ...state,
        unenrolledUsers: action.payload,
        enrolledUsers: [],
        nominatedUsers: [],
        loading: false,
        error: null,
      };
    case "SET_NOMINATED_USERS":
      console.log(state.nominatedUsers)
      return {
        ...state,
        unenrolledUsers: [],
        enrolledUsers: [],
        nominatedUsers: [...action.payload],
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SHOW_TOAST":
      return {
        ...state,
        toast: action.payload,
      };
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
    case "SET_PAGENUMBER":
      return { ...state, pagenumber: action.payload };
      case "SET_TOTAL_PAGES":
        return { ...state, totalpages: action.payload };
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AdminuserReducer, initialState);
  const actions = createActions(dispatch);

  return (
    <UserContext.Provider value={{ state, ...actions }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

type ComponentType<P = {}> = React.ComponentType<P> | undefined;
type WithUserProviderType = <P extends object>(
  SomeComponent: ComponentType<P> | undefined
) => React.FC<P>;
export const WithUserProvider: WithUserProviderType = (SomeComponent) => {
  if (!SomeComponent) {
    return () => null;
  }

  return (props) => (  
    <UserProvider>
      <SomeComponent {...props} />
    </UserProvider>
  );
};

export const createActions = (dispatch: React.Dispatch<Action>) => {
  const getUnEnrolledUsersFromAPI = async (pagenumber: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const response = await getUnenrolledUsers(pagenumber);
    dispatch({ type: "SET_UNENROLLED_USERS", payload: response.data.data });
    
    dispatch({ type: "SET_TOTAL_PAGES", payload: 3 });
    toast.success("Unenrolled users fetched successfully!");
  };

  const getEnrolledUsersFromAPI = async (pagenumber: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const response = await getUsers("enrolled", pagenumber);
    dispatch({ type: "SET_ENROLLED_USERS", payload: response });
    dispatch({ type: "SET_TOTAL_PAGES", payload: 3 });
    toast.success("Enrolled users fetched successfully!");
  };

  const getCertifiedUsersFromAPI = async (pagenumber: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const response = await getUsers("completed", pagenumber);
    dispatch({ type: "SET_ENROLLED_USERS", payload: response });
    dispatch({ type: "SET_TOTAL_PAGES", payload: 3 });
    toast.success("Certified users fetched successfully!");
  };

  const getNominatedFromAPI = async (pagenumber: number) => {
    const response = await getAllNominations(pagenumber);
    dispatch({ type: "SET_NOMINATED_USERS", payload: response });
    dispatch({ type: "SET_TOTAL_PAGES", payload: 3 });
    toast.success("Nominated users fetched successfully!");
  };

  const fetchUsers = async (type: string, pagenumber: number) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      switch (type) {
        case "Enrolled":
          await getEnrolledUsersFromAPI(pagenumber);
          break;
        case "UnEnrolled":
          await getUnEnrolledUsersFromAPI(pagenumber);
          break;
        case "Certified":
          await getCertifiedUsersFromAPI(pagenumber);
          break;
        case "Nominated":
          await getNominatedFromAPI(pagenumber);
          break;
        default:
          return;
      }
    } catch (e) {
    if(e instanceof Error){
      dispatch({ type: "SET_ERROR", payload: e.message });
      toast.error(e.message || "Error fetching users.");
    }
    }
  };

  const sendNominatedUsers = async (userIds: string[], date: Date) => {
    const userWithDate = userIds.map((userId) => ({
      userId: userId,
      targetDate: date,
    }));
    await postNominateUsers(userWithDate);
    setDatepicker(false);
    toast.success("Users nominated successfully!");
  };

  const sendReNominatedUsers = async (userIds: string[], date: Date) => {
    // const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    const userIdWithDate = userIds.map((userId) => ({
      userId: userId,
      targetDate: date,
    }));
    console.log(userIdWithDate);
    await postReNominateUsers(userIdWithDate);
    setDatepicker(false);
    toast.success("Users re-nominated successfully!");
  };

  const uploadCertificate = async (
    data: { certificate: FileList },
    userId: string
  ) => {
    data.certificate = data.certificate[0];
    await uploadCertificateforUser(data, userId);
    fetchUsers("Enrolled", 1);
    setActive(false);
    toast.success("Certificate uploaded successfully!");
  };

  const replaceCertificate = async (
    data: { certificate: FileList },
    enrollment_id: string
  ) => {
    console.log(data, enrollment_id)
    data.certificate = data.certificate[0];
    await replaceCertificateforUser(data, enrollment_id);
    toast.success("Certificate replaced successfully!");
  };

  const searchUser = async (search: string, type: string) => {
    const response = await searchUserByAPI(search, type, 1);
    if (type === "UnEnrolled") {
      dispatch({ type: "SET_UNENROLLED_USERS", payload: response });
    } else if (type === "Enrolled" || type === "Certified") {
      dispatch({ type: "SET_ENROLLED_USERS", payload: response });
    } else if (type === "Nominated") {
      dispatch({ type: "SET_NOMINATED_USERS", payload: response });
    }
  };

  const setActive = (active: boolean) => {
    dispatch({ type: "SET_ACTIVE", payload: active });
  };

  const setDatepicker = (datepicker: boolean) => {
    dispatch({ type: "SET_DATEPICKER", payload: datepicker });
  };

  const setSelectedDate = (selectedDate: Date | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: selectedDate });
  };

  const setCheckedState = (checkedState: boolean[]) => {
    dispatch({ type: "SET_CHECKED_STATE", payload: checkedState });
  };

  const setSearch = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  };

  const setPageNumber = (pagenumber: number) => {
    dispatch({ type: "SET_PAGENUMBER", payload: pagenumber });
    dispatch({ type: "SET_SEARCH", payload: "" });
  };
  const setTotalPages=(pages:number)=>{
    dispatch({ type: "SET_TOTAL_PAGES", payload: pages });
  }

  return {
    getUnEnrolledUsersFromAPI,
    getEnrolledUsersFromAPI,
    getCertifiedUsersFromAPI,
    sendNominatedUsers,
    sendReNominatedUsers,
    fetchUsers,
    uploadCertificate,
    replaceCertificate,
    getNominatedFromAPI,
    searchUser,
    setActive,
    setDatepicker,
    setSelectedDate,
    setCheckedState,
    setSearch,
    setPageNumber,
    setTotalPages
  };
};
