import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./unenrolled.module.scss";
import { columnUnEnrolledData } from "./columndata";
import { UnEnrolledContext, WithUnEnrolled } from "./UnEnrolledContext";
import Pagination from "../../components/UI components/Pagination/Pagination";
import UserDataTable from "../../components/Admin/Users/UserDataTable/UserDataTable";
import SearchBar from "../../components/UI components/SearchBar/SearchBar";
import Button from "../../components/UI components/Button/button";
import DatePickerComponent from "../../components/UI components/DatePicker/DatePicker";
import Popup from "../../components/UI components/Popup/popup";
import debounce from "lodash/debounce";

function UnEnrolled() {
  const {
    state,
    getUnEnrolledUsersFromAPI,
    setPageNumber,
    setSearch,
    searchUser,
    setSelectedDate,
    setDatepicker,
    sendNominatedUsers,
    setNominatedUsers,
    addToNominated,
    setActive,
  } = useContext(UnEnrolledContext)!;


  const [checkedState, setCheckedState] = useState<boolean[]>([]);

  useEffect(() => {
    getUnEnrolledUsersFromAPI(state.pagenumber);
  }, [state.pagenumber]);
  
  useEffect(() => {
    setActive(checkedState.some((checked) => checked));
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

  const handleNominations = async () => {
    await sendNominatedUsers(state.nominatedUsers, state.selectedDate!);
    setNominatedUsers([]);
  };

  const handleCheckBoxChange = (index: number) => {
    const newCheckedState = checkedState.map((checked, i) =>
      i === index ? !checked : checked
    );
    setCheckedState(newCheckedState);
    addToNominated(state.unenrolledUsers[index]._id, newCheckedState[index]);
  };

  useEffect(() => {
    if (
      state.unenrolledUsers &&
      state.unenrolledUsers.length > 0 &&
      setCheckedState
    ) {
      setCheckedState(state.unenrolledUsers.map(() => false));
    }
  }, [state.unenrolledUsers]);

  const renderProps = (data: any, index: number) => {
    return (
      <td>
        {" "}
        <input
          type="checkbox"
          checked={checkedState[index] || false}
          onChange={() => handleCheckBoxChange(index)}
        />
      </td>
    );
  };

  return (
    <div className={styles.UnEnrolledPage}>

      <div className={styles.Actions}>
        <SearchBar search={state.search} setSearch={setSearch} />
        {state.active ? (
          <Button
            type={"submit"}
            bgColor={""}
            handleClick={() => setDatepicker(true)}
          >
            Nominate All
          </Button>
        ) : (
          <h5>Select Users to Nominate</h5>
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
              handleNominations();
              setDatepicker(false);
            }}
          >
            Select
          </Button>
          <Button
            type={"submit"}
            bgColor={""}
            handleClick={() => setDatepicker(false)}
          >
            Cancel
          </Button>
        </>
      </Popup>
      <UserDataTable
        columns={columnUnEnrolledData}
        userData={state.unenrolledUsers}
        renderAction={renderProps}
      />
      <Pagination
        pagenumber={state.pagenumber}
        setPageNumber={setPageNumber}
        totalPages={state.totalpages}
      />
    </div>
  );
}

export default WithUnEnrolled(UnEnrolled);
