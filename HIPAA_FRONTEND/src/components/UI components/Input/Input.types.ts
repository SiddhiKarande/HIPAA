import { FieldValues, UseFormRegister } from "react-hook-form";

export interface InputProps<T extends FieldValues> {
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
}

