import React, { createContext, useReducer, ReactNode } from "react";
import {
  initialState,
  nominatedReducer,
} from "./NominatedUsers.state";
import {
  getAllNominations,
  searchUserByAPI,
} from "../../services/User.service";
import { NominatedContextProps } from "./Nominated.types";


export const NominatedContext = createContext<
  NominatedContextProps | undefined
>(undefined);

export const NominatedProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(nominatedReducer, initialState);
  const actions = NominatedActions(dispatch);
  return (
    <NominatedContext.Provider
      value={{
        state,
        ...actions,
      }}
    >
      {children}
    </NominatedContext.Provider>
  );
};

export const WithNominated = (Component: React.ComponentType) => (props: any) =>
  (
    <NominatedProvider>
      <Component {...props} />
    </NominatedProvider>
  );

const NominatedActions = (dispatch: any) => {
  const getNominatedUsersFromAPI = async (pagenumber: number) => {
    const response = await getAllNominations(pagenumber);
    dispatch({ type: "SET_NOMINATED_USERS", payload: response.users });
    dispatch({ type: "SET_TOTAL_PAGES", payload: response.totalPages });
  };

  const searchUser = async (search: string, page: number) => {
    const response = await searchUserByAPI(search,"Nominated", page);
    dispatch({ type: "SET_NOMINATED_USERS", payload: response.users });
    dispatch({ type: "SET_TOTAL_PAGES", payload: response.totalPages });
  };

  const setPageNumber = (page: number) => {
    dispatch({ type: "SET_PAGE_NUMBER", payload: page });
  };

  const setSearch = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  };

  return { getNominatedUsersFromAPI, searchUser, setPageNumber, setSearch };
};
