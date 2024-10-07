import styles from "./Certified.module.scss";
import Pagination from "../../components/UI components/Pagination/Pagination";
import { useCallback, useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import UserDataTable from "../../components/Admin/Users/UserDataTable/UserDataTable";
import { CertifiedContext, WithCertified } from "./CertifiedContext";
import { columnCertifiedData } from "./CertifiedData";
import Button from "../../components/UI components/Button/button";
import DatePickerComponent from "../../components/UI components/DatePicker/DatePicker";
import Popup from "../../components/UI components/Popup/popup";
import SearchBar from "../../components/UI components/SearchBar/SearchBar";
import { MdFileUpload } from "react-icons/md";
import FileDownloader from "../../components/UI components/FileDownloader/FileDownloader";
import { toast } from "react-toastify";
import Loader from "../../components/UI components/Loader/Loader";
import FileUploader from "../../components/UI components/FileUploader/FileUploader";

const Certified = () => {
  const {
    state,
    getCertifiedUsersFromAPI,
    setPageNumber,
    setSearch,
    searchUser,
    setSelectedDate,
    setDatepicker,
    sendReNominatedUsers,
    setReNominatedUsers,
    addToReNominated,
    replaceCertificate,
  } = useContext(CertifiedContext)!;

  const [checkedState, setCheckedState] = useState<boolean[]>([]);
  const [active, setactive] = useState(false);

  useEffect(() => {
    getCertifiedUsersFromAPI(state.pagenumber);
  }, []);

  useEffect(() => {
    setactive(checkedState.some((checked) => checked));
  }, [checkedState]);

  const debouncedSearchUser = useCallback(
    debounce((search) => {
      searchUser(search, state.pagenumber);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearchUser(state.search);
  }, [state.search, debouncedSearchUser]);

  const handleReNominations = async () => {
    await sendReNominatedUsers(state.renominatedUsers, state.selectedDate!);
    setReNominatedUsers([]);
  };

  const handleCheckBoxChange = (index: number) => {
    const newCheckedState = checkedState.map((checked, i) =>
      i === index ? !checked : checked
    );
    setCheckedState(newCheckedState);
    addToReNominated(
      state.certifiedUsers[index].userId?._id,
      newCheckedState[index]
    );
  };

  const handlereplace =
    (enrollmentId: string) => async (data: { certificate: FileList }) => {
      await replaceCertificate(data, enrollmentId);
      console.log(enrollmentId);
      setActive(false);
    };

  useEffect(() => {
    if (
      state.certifiedUsers &&
      state.certifiedUsers.length > 0 &&
      setCheckedState
    ) {
      setCheckedState(state.certifiedUsers.map(() => false));
    }
  }, [state.certifiedUsers]);

  const renderProps = (data: any, index: number) => {
    return (
      <td>
        <div className={styles.DownloadUpload}>
          <FileDownloader enrollment_id={data._id} email={data.userId.email} />
          <FileUploader enrollment_id={data._id} />
          <input
            type="checkbox"
            checked={checkedState[index]}
            onChange={() => handleCheckBoxChange(index)}
            value={''}
            className={styles.Margin}
          />
        </div>
      </td>
    );
  }

  return (
    <div className={styles.Certified}>
      <div className={styles.LoaderContainer}>
        {state.loading && <Loader />}
      </div>

      <div className={styles.Actions}>
        <SearchBar search={state.search} setSearch={setSearch} />
        {active ? (
          <Button
            type={"submit"}
            bgColor={""}
            handleClick={() => setDatepicker(true)}
          >
            Re-Nominate All
          </Button>
        ) : (
          <h5>Select Users to Re-Nominate</h5>
        )}
      </div>
      <Popup isOpen={state.datepicker} onClose={() => setDatepicker(false)}>
        <>
          <DatePickerComponent
            selectedDate={state.selectedDate!}
            handleChange={setSelectedDate}
          />
          <Button
            type={"submit"}
            bgColor={""}
            handleClick={() => {
              handleReNominations();
              setDatepicker(false);
            }}
          >
            Re-Nominate
          </Button>
          <Button
            type={"submit"}
            bgColor={""}
            handleClick={() => setDatepicker(false)}
          >
            Cancel
          </Button>
          {!active && <h5>Select Users to Re-Nominate</h5>}
        </>
      </Popup>

      <UserDataTable
        columns={columnCertifiedData}
        userData={state.certifiedUsers}
        renderAction={renderProps}
      />
      <Pagination
        pagenumber={state.pagenumber}
        setPageNumber={setPageNumber}
        totalPages={state.totalpages}
      />
    </div>
  );
};
export default WithCertified(Certified);
