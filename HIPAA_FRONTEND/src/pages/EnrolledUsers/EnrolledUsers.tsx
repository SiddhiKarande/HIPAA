import { useContext, useEffect, useState, useCallback } from "react";
import styles from "./Enrolled.module.scss";
import SearchBar from "../../components/UI components/SearchBar/SearchBar";
import UserDataTable from "../../components/Admin/Users/UserDataTable/UserDataTable";
import { columnEnrolledData } from "./columndata";
import Pagination from "../../components/UI components/Pagination/Pagination";
import { EnrolledContext, WithEnrolledUsers } from "./EnrolledUsersContext";
import Button from "../../components/UI components/Button/button";
import Popup from "../../components/UI components/Popup/popup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import Loader from "../../components/UI components/Loader/Loader";

const Enrolled = () => {
  const {
    enrolledstate,
    getEnrolledUsersFromAPI,
    setSearch,
    setPageNumber,
    searchUser,
    setActive,
    uploadCertificate
  } = useContext(EnrolledContext)!;
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const handleupload = async (data: { certificate: FileList }) => {
    if (!data || !data.certificate || !data.certificate[0]) {
      toast.error("Certificate is missing");
      return;
    }
    await uploadCertificate(data, activeUserId!);
    setActive(false);
  };

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getEnrolledUsersFromAPI(enrolledstate.pagenumber);
  }, []);

  const debouncedSearchUser = useCallback(
    debounce((search) => {
      searchUser(search);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearchUser(enrolledstate.search);
  }, [enrolledstate.search, debouncedSearchUser]);

  function renderAction(data: any, index: number) {
    return (
      <td key={`action-${data._id}`}>
        {data.progress == 100 && (
          <>
            <Button
              type={"button"}
              handleClick={() => {
                setActiveUserId(data.userId._id);
                setActive(true);
              }}
            >
              Upload
            </Button>
            <Popup isOpen={enrolledstate.active} onClose={() => setActive(false)}>
              <form onSubmit={handleSubmit(handleupload)}>
                <input type="file" {...register("certificate")} />
                <Button type={"submit"} bgColor={""} handleClick={() => { setActiveUserId(data._id) }}>
                  Upload
                </Button>
              </form>
            </Popup>
          </>
        )}
      </td>
    );
  }

  return (
    <div className={styles.EnrolledPage}>

      <div className={styles.Actions}>
        <SearchBar search={enrolledstate.search} setSearch={setSearch} />
      </div>
      <UserDataTable
        columns={columnEnrolledData}
        userData={enrolledstate.enrolledUsers}
        renderAction={renderAction}
      />
      <Pagination
        pagenumber={enrolledstate.pagenumber}
        setPageNumber={setPageNumber}
        totalPages={enrolledstate.totalpages}
      />
    </div>
  );
};

export default WithEnrolledUsers(Enrolled);
