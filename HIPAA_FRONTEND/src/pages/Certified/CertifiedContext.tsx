import { createContext, useReducer, ReactNode, Dispatch, ComponentType } from "react";
import { getUsers, postReNominateUsers, replaceCertificateforUser, searchUserByAPI } from "../../services/User.service";
import { toast } from "react-toastify";
import { CertifiedContextType } from "./Certified.types";
import { CertifiedAction, CertifiedReducer, initialState } from "./Certified.state";

interface CertifiedContextProps {
  children: ReactNode;
}
export const CertifiedContext = createContext<CertifiedContextType | undefined>(undefined);

const CertifiedContextProvider = ({children}:CertifiedContextProps) => {
  const [state, dispatch] = useReducer(CertifiedReducer, initialState)
  const actions = createCertifiedActions(dispatch);
  return (
    <CertifiedContext.Provider value={{state, ...actions}}>
      {children}
    </CertifiedContext.Provider>
  )
}

export const WithCertified = (SomeComponent:ComponentType) => {
  return ()=><CertifiedContextProvider><SomeComponent/></CertifiedContextProvider>
}

const createCertifiedActions = (dispatch: Dispatch<CertifiedAction>) => {
  const getCertifiedUsersFromAPI = async (pagenumber: number) => {
    try {
      const response = await getUsers('completed', pagenumber);

      dispatch({ type: "SET_CERTIFIED_USERS", payload: response.users });
      dispatch({ type: "SET_TOTAL_PAGES", payload: response.totalPages || 1 });

    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch certified users." });
      toast.error("Failed to fetch certified users.");
    } 
  };

  const searchUser = async (search: string,pagenumber:number) => {
    const response = await searchUserByAPI(search, "completed",pagenumber);
    dispatch({ type: "SET_CERTIFIED_USERS", payload: response.users});
  };

  const setActive = (active: boolean) => {
    dispatch({ type: "SET_ACTIVE", payload: active });
  };

  const setDatepicker = (datepicker: boolean) => {
    dispatch({ type: "SET_DATEPICKER", payload: datepicker });
  };

  const setSelectedDate = (date: Date | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  };

  const setCheckedState = (checkedState: boolean[]) => {
    dispatch({ type: "SET_CHECKED_STATE", payload: checkedState });
  };

  const setSearch = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  };

  const setPageNumber = (pagenumber: number) => {
    dispatch({ type: "SET_PAGE_NUMBER", payload: pagenumber });
  };

  const sendReNominatedUsers = async (userIds: string[], date: Date) => {
    const userIdWithDate = userIds.map((userId) => ({
      userId: userId,
      targetDate: date,
    }));
    console.log(userIdWithDate);
    await postReNominateUsers(userIdWithDate);
    setDatepicker(false);
    toast.success("Users re-nominated successfully!");
  };

  const addToReNominated = (userid: string, isChecked: boolean) => {
    dispatch({ type: "ADD_TO_RENOMINATED", payload: { userid, isChecked } });
  };

  const setReNominatedUsers = (renominatedUsers: string[]) => {
    dispatch({ type: "SET_RENOMINATED_USERS", payload: renominatedUsers });
  };

  const replaceCertificate = async (
    data: { certificate: FileList },
    enrollment_id: string
  ) => {
    data.certificate = data.certificate[0];
    await replaceCertificateforUser(data, enrollment_id);
    toast.success("Certificate replaced successfully!");
  };

  return {
    getCertifiedUsersFromAPI,
    searchUser,
    setActive,
    setDatepicker,
    setSelectedDate,
    setCheckedState,
    setSearch,
    setPageNumber,
    sendReNominatedUsers,
    setReNominatedUsers,
    addToReNominated,
    replaceCertificate
  };
};