import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./NominatedUsers.module.scss";
import Pagination from "../../components/UI components/Pagination/Pagination";
import UserDataTable from "../../components/Admin/Users/UserDataTable/UserDataTable";
import SearchBar from "../../components/UI components/SearchBar/SearchBar";
import debounce from "lodash/debounce";
import { NominatedContext, WithNominated } from "./NominatedContext";
import { columnNominatedData } from "./columnData";
import Loader from "../../components/UI components/Loader/Loader";
import { NominatedProps } from "./Nominated.types";

function Nominated() {
  const {
    state,
    getNominatedUsersFromAPI,
    setPageNumber,
    setSearch,
    searchUser,
  } = useContext(NominatedContext)!;

  useEffect(() => {
    getNominatedUsersFromAPI(state.pagenumber);
  }, [state.pagenumber]);

  const debouncedSearchUser = useCallback(
    debounce((search) => {
      searchUser(search, state.pagenumber);
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSearchUser(state.search);
  }, [state.search, debouncedSearchUser]);

  const renderProps = (data: NominatedProps, index: number) => {
    return <td>Nominated</td>;
  };
  return (
    <div className={styles.Nominated}>

      <div className={styles.Actions}>
        <SearchBar search={state.search} setSearch={setSearch} />
      </div>

      <UserDataTable
        columns={columnNominatedData}
        userData={state.nominatedUsers}
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

export default WithNominated(Nominated);
