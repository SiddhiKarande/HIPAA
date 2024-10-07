import { CredentialResponse } from "@react-oauth/google";
import { PropsWithChildren } from "react";
import { Roles } from "../../constants";

export interface AuthStateType {
  roleName: string;
  email: string;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: Roles;
  handleOAuthLogin: (credentialResponse: CredentialResponse) => Promise<{ token: string, role: string }>;
  logout: () => void;
}

export interface AuthProviderProps extends PropsWithChildren {}

export interface LoginProps { }
