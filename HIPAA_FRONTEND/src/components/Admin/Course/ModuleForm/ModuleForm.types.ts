import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { EditModuleInputs } from "../EditModule/EditModule.types";

export interface ModuleFormFieldsProps {
  register: UseFormRegister<EditModuleInputs>;
  errors: FieldErrors;
  watch: UseFormWatch<EditModuleInputs>; 
  isEditMode: boolean;
  _id?: string;
}