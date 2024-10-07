import { ComponentType, ReactNode, createContext, useReducer } from "react";
import { toast } from "react-toastify";
import { getUsers, searchUserByAPI, uploadCertificateforUser } from "../../services/User.service";
import { EnrolledUserReducer, initialState } from "./EnrolledUsers.state";
import { EnrolledContextType } from "./EnrolledUsers.types";
export const EnrolledContext = createContext<EnrolledContextType | undefined>(undefined);

const EnrolledContextProvider = ({ children }: { children: ReactNode }) => {
  const [enrolledstate, dispatch] = useReducer(EnrolledUserReducer, initialState);
const actions=createEnrolledActions(dispatch);
  return (
    <EnrolledContext.Provider value={{ enrolledstate, ...actions}}>
      {children}
    </EnrolledContext.Provider>
  );
};

export  const WithEnrolledUsers=(SomeComponent:ComponentType)=>{
  return ()=><EnrolledContextProvider>
    <SomeComponent/>
  </EnrolledContextProvider>

}



function createEnrolledActions(dispatch:any){
    
  const getEnrolledUsersFromAPI = async (pagenumber: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getUsers('enrolled',pagenumber); 
  
      dispatch({ type: 'SET_ENROLLED_USERS', payload: response?.users });
      dispatch({ type: 'SET_TOTALPAGES', payload: response?.totalPages || 1 });
  
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch enrolled users.' });
      toast.error("Failed to fetch enrolled users.");
    }
  };

  
  const searchUser = async (search: string) => {
    const response = await searchUserByAPI(search, "enrolled");
    dispatch({ type: "SET_UNENROLLED_USERS", payload: response.users});
  };


  const uploadCertificate = async (
    data: { certificate: FileList },
    userId: string
  ) => {
    data.certificate = data.certificate[0];
    await uploadCertificateforUser(data, userId);
    getEnrolledUsersFromAPI(1)
    setActive(false);
    toast.success("Certificate uploaded successfully!");
  };

  const setSearch = (search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search });
  };

  const setPageNumber = (pagenumber: number) => {
    dispatch({ type: 'SET_PAGENUMBER', payload: pagenumber });
  };
  const setActive = (active: boolean) => {
    dispatch({ type: 'SET_ACTIVE', payload: active });
  };



  return {getEnrolledUsersFromAPI,setSearch,setPageNumber,uploadCertificate,setActive,searchUser}

}