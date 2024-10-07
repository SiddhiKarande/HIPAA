import { createContext, useReducer, ReactNode, Dispatch, Component, ComponentType } from "react";
import { UnEnrolledReducer, initialState, UnEnrolledState, UnEnrolledAction } from "./UnEnrolled.state";
import { getUnenrolledUsers, getUsers, postNominateUsers, searchUserByAPI } from "../../services/User.service";
import { toast } from "react-toastify";
import { UnEnrolledContextType } from "./UnEnrolled.types";

interface UnEnrolledContextProps {
  children: ReactNode;
}
export const UnEnrolledContext = createContext<UnEnrolledContextType | undefined>(undefined);

const UnEnrolledContextProvider = ({children}:UnEnrolledContextProps) => {
  const [state,dispatch]=useReducer(UnEnrolledReducer,initialState)
  const actions=createUnenrolledActions(dispatch);
  return (
    <UnEnrolledContext.Provider value={{state,...actions}}>
      {children}
    </UnEnrolledContext.Provider>
  )
}

export const WithUnEnrolled=(SomeComponent:ComponentType)=>{
  return ()=><UnEnrolledContextProvider><SomeComponent/></UnEnrolledContextProvider>
}

const createUnenrolledActions = (dispatch: Dispatch<UnEnrolledAction>) => {
  const getUnEnrolledUsersFromAPI = async (pagenumber: number) => {
    try {
      const response = await getUsers('unenrolled',pagenumber);
      dispatch({ type: "SET_UNENROLLED_USERS", payload: response?.users });
      dispatch({ type: "SET_TOTAL_PAGES", payload: response?.totalPages || 1 });
      
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch unenrolled users." });
      toast.error("Failed to fetch unenrolled users.");
    }
  };

  const searchUser = async (search: string,pagenumber:number) => {
    const response = await searchUserByAPI(search, "unenrolled",pagenumber);

    dispatch({ type: "SET_UNENROLLED_USERS", payload: response.users });
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

  const setNominatedUsers = (nominatedUsers: string[]) => {
    dispatch({ type: "SET_NOMINATED_USERS", payload: nominatedUsers });
  };

  const addToNominated = (userid: string, isChecked: boolean) => {
    dispatch({ type: "ADD_TO_NOMINATED", payload: { userid, isChecked } });
  };

  return {
    getUnEnrolledUsersFromAPI,
    setActive,
    setDatepicker,
    setSelectedDate,
    setCheckedState,
    setSearch,
    setPageNumber,
    searchUser,
    sendNominatedUsers,
    setNominatedUsers,
    addToNominated,
  };
};


