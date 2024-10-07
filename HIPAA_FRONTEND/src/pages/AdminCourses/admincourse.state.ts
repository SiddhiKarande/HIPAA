import { SubmitHandler } from "react-hook-form";
import {
  ModuleProp,
  ModuleProps,
} from "../../components/Admin/Course/Module/Module.types";
import { EditModuleInputs } from "../../components/Admin/Course/EditModule/EditModule.types";

export interface AdminModuleReducerState {
  modules: ModuleProps[];
  loading: boolean;
  enrollmentStatus: string;
  progress: number;
  error: string | null;
  moduleSequence: ModuleProp[];
  drag: boolean;
  showModule:boolean,
}

export const initialState: AdminModuleReducerState = {
  modules: [],
  loading: false,
  error: null,
  enrollmentStatus: "unenrolled",
  progress: 0,
  moduleSequence: [],
  drag: false,
  showModule:false,
  totalpages:1,
};

export type GetModules = () => Promise<void>;
export type OnAddModule = SubmitHandler<EditModuleInputs>;
export type HandleDeleteModule = (_id: string) => Promise<void>;
export type OnSubmitEditModule = (data: EditModuleInputs, _id: string) => Promise<void>;
export type EnrollUser = () => Promise<void>;
export type HandleSaveSequence = (moduleSequence: ModuleProp[]) => Promise<void>;
export type SetEnrollmentStatus = (newStatus: string) => Promise<void>;
export type SetProgress = (newProgress: number) => Promise<void>;
export type SetModuleSequence = (moduleSeuqnce: ModuleProp) => Promise<void>;
export type SetDrag = (drag:boolean) => Promise<void>;
export type SetShowModule = (show:boolean) => Promise<void>;
export type  SetTotalPages=(pages:number)=>Promise<void>;
 export interface Actions {
  getModules: GetModules;
  onAddModule: OnAddModule;
  handleDeleteModule: HandleDeleteModule;
  enrollUser: EnrollUser;
  handleSaveSequence: HandleSaveSequence;
  setEnrollmentStatus: SetEnrollmentStatus;
  setProgress: SetProgress;
  onSubmitEditModule: OnSubmitEditModule;
  setModuleSequence:SetModuleSequence,
  setDrag:SetDrag,
  setShowModule: SetShowModule;
  setTotalPages:SetTotalPages;
 }
export type AdminCourseAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: ModuleProps[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_MODULE"; payload: ModuleProps }
  | { type: "EDIT_MODULE"; payload: ModuleProps }
  | { type: "DELETE_MODULE"; payload: string }
  | { type: "SET_ENROLLMENT_STATUS"; payload: string }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_MODULE_SEQUENCE"; payload: ModuleProp[] }
  | { type: "SET_DRAG"; payload: boolean }
  | { type: "SET_SHOW_MODULE"; payload: boolean }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  
  export interface AdminModuleReducerState {
    modules: ModuleProps[];
    loading: boolean;
    enrollmentStatus: string;
    progress: number;
    error: string | null;
    moduleSequence: ModuleProp[];
    drag: boolean;
    showModule:boolean;
    totalpages:number;
  }

  
  export const adminCourseReducer = (
    state: AdminModuleReducerState,
    action: AdminCourseAction
  ): AdminModuleReducerState => {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, loading: true, error: null };
      case "FETCH_SUCCESS":
        return { ...state, loading: false, modules: action.payload };
      case "FETCH_ERROR":
        return { ...state, loading: false, error: action.payload };
      case "ADD_MODULE":
        return { ...state, modules: [...state.modules, action.payload] };
      case "EDIT_MODULE":
        const updatedModules = state.modules.map((module) =>
          module._id === action.payload._id ? action.payload : module
        );
        return {
          ...state,
          modules: updatedModules,
        };
      case "DELETE_MODULE":
        return {
          ...state,
          modules: state.modules.filter(
            (module) => module._id !== action.payload
          ),
        };
      case "SET_ENROLLMENT_STATUS":
        return { ...state, enrollmentStatus: action.payload };
      case "SET_PROGRESS":
        return { ...state, progress: action.payload };
      case "SET_MODULE_SEQUENCE":
        return { ...state, moduleSequence: action.payload };
      case "SET_DRAG":
        return { ...state, drag: action.payload };
      case "SET_SHOW_MODULE":
        return { ...state, showModule: action.payload };
       
      default:
        return state;
    }
  };
  
