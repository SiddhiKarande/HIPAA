import { Roles } from "../constants";

const role = localStorage.getItem("userRole");
const CURRENT_USER_TYPE = role;

export const GUARDS = {
  isAdmin: () => CURRENT_USER_TYPE === Roles.ADMIN,
  isUser: () => CURRENT_USER_TYPE === Roles.USER,
};
