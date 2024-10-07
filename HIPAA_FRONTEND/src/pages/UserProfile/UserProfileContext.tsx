import React, {
  createContext,
  FC,
  useReducer,
  ComponentType,
  ReactNode,
} from "react";
import { UserProfileReducerState } from "./UserProfile.types";
import {
  UserProfileAction,
  UserProfileReducer,
  createActions,
  initialState,
} from "./UserProfile.state";

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export type GetProfileData = () => void;

interface UserContextProps {
  state: UserProfileReducerState;
  getProfileData: GetProfileData;
}

interface UserProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProps> = ({ children }) => {
  const [state, dispatch] = useReducer(UserProfileReducer, initialState);
  const {
    getProfileData
  } = createActions(dispatch);

  return (
    <UserContext.Provider 
      value={{ 
        state, 
        getProfileData 
      }}>
      {children}
    </UserContext.Provider>
  );
};

type WithUserProfileProviderType = (SomeComponent: ComponentType) => React.FC;

export const WithUserProfileProvider: WithUserProfileProviderType = (
  SomeComponent
) => {
  if (!SomeComponent) {
    return () => null;
  }

  return () => (
    <UserProvider>
      <SomeComponent />
    </UserProvider>
  );
};
export type UserProfileDispatch = (action: UserProfileAction) => void;
