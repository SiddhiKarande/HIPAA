import React, {
  createContext,
  useReducer,
  ReactNode,
} from "react";
import {
  adminCourseReducer,
  initialState,
  AdminModuleReducerState,
  GetModules,
  HandleDeleteModule,
  OnSubmitEditModule,
  AdminCourseAction,
} from "./admincourse.state";
import { SubmitHandler } from "react-hook-form";
import { AddModuleInputs } from "../../components/Admin/Course/AddModule/AddModule.types";
import { ModuleProp } from "../../components/Admin/Course/Module/Module.types";
import {
  enrollUserOnCLick,
  getModuleData,
  handleDeleteModuleService,
  postAddModule,
  postEditModule,
  sendSavedModuleSequence,
} from "../../services/Module.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditModuleInputs } from "../../components/Admin/Course/EditModule/EditModule.types";

interface AdminCourseContextProps {
  state: AdminModuleReducerState;
  getModules: GetModules;
  onAddModule: SubmitHandler<AddModuleInputs>;
  handleDeleteModule: HandleDeleteModule;
  onSubmitEditModule: OnSubmitEditModule;
  enrollUser: () => Promise<void>;
  handleSaveSequence: (moduleSequence: ModuleProp[]) => Promise<void>;
  setEnrollmentStatus: (newStatus: string) => Promise<void>;
  setProgress: (newProgress: number) => Promise<void>;
  setDrag: (drag: boolean) => void;
  setModuleSequence: (moduleSequence: ModuleProp[]) => void;
  setShowModule: (show: boolean) => void;
  setTotalPages: (pages: number) => void;
}

export const AdminCourseContext = createContext<
  AdminCourseContextProps | undefined
>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const AdminCourseProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(adminCourseReducer, initialState);
  const actions = createActions(dispatch);

  return (
    <AdminCourseContext.Provider
      value={{
        state,
        ...actions,
      }}
    >
      {children}
    </AdminCourseContext.Provider>
  );
};

type ComponentType<P = {}> = React.ComponentType<P> | undefined;
type WithAdminCourseProviderType = <P extends object>(SomeComponent: ComponentType<P>) => React.FC<P>;
export const WithAdminCourseProvider: WithAdminCourseProviderType = (
  SomeComponent
) => {
  if (!SomeComponent) {
    return () => null;
  }

  return (props) => (
    <AdminCourseProvider>
      <SomeComponent {...props} />
    </AdminCourseProvider>
  );
};

export const createActions = (dispatch: React.Dispatch<AdminCourseAction>) => {
  const getModules = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getModuleData();
      const sortedData = data.sort(
        (a: { sequenceNumber: number }, b: { sequenceNumber: number }) =>
          a.sequenceNumber - b.sequenceNumber
      );
      dispatch({ type: "FETCH_SUCCESS", payload: sortedData });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Error while fetching Modules Data",
      });
      toast.error("Error while fetching Modules Data");
    }
  };

  const onSubmitEditModule = async (data: EditModuleInputs, _id: string) => {
    await postEditModule(data, _id);
    const dataAfterEditing = await getModuleData();
    dispatch({ type: "FETCH_SUCCESS", payload: dataAfterEditing });
    dispatch({ type: "SET_SHOW_MODULE", payload: false });
    toast.success("Module edited successfully!");
  };

  const onAddModule: SubmitHandler<AddModuleInputs> = async (data) => {
    data.questionsCSV = data.questionsCSV[0];
    const response = await postAddModule(data);
    if (response && response._id) {
      const newModule = { ...data, _id: response._id };
      dispatch({ type: "ADD_MODULE", payload: newModule });
      dispatch({ type: "SET_SHOW_MODULE", payload: false });
      toast.success("Module added successfully!");
    }
  };

  const handleDeleteModule = async (_id: string) => {
    await handleDeleteModuleService(_id);
    dispatch({ type: "DELETE_MODULE", payload: _id });
    toast.success("Module deleted successfully!");
  };

  const enrollUser = async () => {
    try {
      const response = await enrollUserOnCLick();
      if (response === 200) {
        toast.success("Enrolled successfully!");
        setEnrollmentStatus("enrolled");
        getModules();
      }
    } catch (error) {
      toast.error("Error while Enrolling");
    }
  };

  const handleSaveSequence = async (
    moduleSequence: ModuleProp[]
  ): Promise<void> => {
    const ids = moduleSequence.map((module) => module._id);
    console.log(ids);
    await sendSavedModuleSequence(ids);
    toast.success("Module sequence saved successfully!");
    getModules();
  };

  async function setEnrollmentStatus(newStatus: string) {
    dispatch({ type: "SET_ENROLLMENT_STATUS", payload: newStatus });
  }

  async function setProgress(newProgress: number) {
    dispatch({ type: "SET_PROGRESS", payload: newProgress });
  }

  const setDrag = (drag: boolean) => {
    dispatch({ type: "SET_DRAG", payload: drag });
  };

  const setModuleSequence = (moduleSequence: ModuleProp[]) => {
    dispatch({ type: "SET_MODULE_SEQUENCE", payload: moduleSequence });
  };

  const setShowModule = (show: boolean) => {
    dispatch({ type: "SET_SHOW_MODULE", payload: show });
  };

  return {
    getModules,
    onSubmitEditModule,
    onAddModule,
    handleDeleteModule,
    enrollUser,
    handleSaveSequence,
    setEnrollmentStatus,
    setProgress,
    setDrag,
    setModuleSequence,
    setShowModule,
  };
};
