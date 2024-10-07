import  { createContext, useState, FC, useEffect, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "./auth.types";
import { loginUser } from "../../services/Login.service";
import { CredentialResponse } from "@react-oauth/google";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {   
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const handleOAuthLogin = async (credentialResponse: CredentialResponse): Promise<{token: string, role: string}> => {
    try {
      const response = await loginUser(credentialResponse);
      if (response?.role && response?.token) {
        setAuthenticated(true);
        setUserRole(response.role);
      }
      return response!;
    } catch (error) {
      throw new Error;
    }
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    setAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, handleOAuthLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)!;
  if (context === null) {
    throw new Error("useAuth error");
  }
  return context;
};

type WithAuthProviderType = (SomeComponent: React.ComponentType<any>) => React.FC;
export const WithAuthProvider: WithAuthProviderType = (SomeComponent) => {
  return () => (
    <AuthProvider>
      <SomeComponent />
    </AuthProvider>
  );
};

