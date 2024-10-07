import { CredentialResponse } from "@react-oauth/google";
import axiosInstance from "./axiosInstance"

export const loginUser = async (credential: CredentialResponse) => {
  try {
    const {data} = await axiosInstance.post('/api/auth/google', credential, {
      headers: {
        authorization: `${credential.credential}`
      },
    });
    const token = data.data.token;
    const role = data.data.role
    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
    }
    return {
      token: token,
      role: role
    };
  } catch (error) {
   throw error;
  }
}