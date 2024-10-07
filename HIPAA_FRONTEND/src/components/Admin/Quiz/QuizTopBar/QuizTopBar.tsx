import { useContext, useState } from "react";
import { Roles } from "../../../../constants";
import { useAuth } from "../../../../pages/Login/authcontext";
import Button from "../../../UI components/Button/button";
import Popup from "../../../UI components/Popup/popup";
import SearchBar from "../../../UI components/SearchBar/SearchBar";
import styles from "./QuizTopBar.module.scss";
import { QuizContext } from "../../../../pages/Quiz/QuizContext";
import { useParams, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function QuizTopBar() {
  const auth = useAuth();
  const {
    state,
    searchQuestion,
    searchQuestionName,
    sendAnswerResponse,
    AddMoreQuestions,
    setOpen,
    handleDeleteQuestions,
    submitQuiz,
  } = useContext(QuizContext)!;
  const { register, handleSubmit } = useForm();
  const [showDelete, setShowDelete] = useState(false);
  const handleSearch = () => {
    searchQuestion(state.search, moduleId!, state.pageNumber);
  };
  const navigate = useNavigate();
  const [showDeleteModule, setShowDeleteModule] = useState(false);
  const { moduleId } = useParams();

  const handleAddMore: SubmitHandler<FieldValues> = (data) => {
    AddMoreQuestions(data, moduleId!);
  };
  const onSubmitHandleDelete  = () => {
    handleDeleteQuestions(state.deleted, moduleId!)
    setShowDelete(false)
  }

  return (
    <>
      <div className={styles.QuizTopBar}>

        {auth.userRole === Roles.USER && (
          <h1 className={styles.AttemptQuizHeader}>Attempt Quiz</h1>
        )}

        {auth.userRole === Roles.ADMIN
          && <Popup isOpen={showDeleteModule}
            onClose={() => setShowDeleteModule(false)}
          >
            <div className={styles.DeletePopup}>
              <p>Are you sure you want to delete?</p>
              <div className={styles.DeletePopupBtns}>
                <Button type={"submit"} handleClick={() => {
                  handleDeleteQuestions(state.deleted, moduleId!)
                  setShowDeleteModule(false)
                }}>
                  Yes
                </Button>
                <Button
                  type={"submit"}
                  handleClick={() => setShowDeleteModule(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>}

        {auth.userRole === Roles.ADMIN && (
          <>
            <SearchBar
              search={state.search}
              setSearch={searchQuestionName}
            />
            <div className={styles.ButtonContainer}>
              <Button
                type={"button"}
                bgColor={""}
                handleClick={() => setOpen(true)}
              >
                Upload More Questions
              </Button>
              <Popup isOpen={state.open} onClose={() => setOpen(false)}>
                <form
                  className={styles.UploadQuestions}
                  onSubmit={handleSubmit(handleAddMore)}
                >
                  <input
                    {...register("questionsCSV")}
                    type="file"
                    accept=".csv"
                    className={styles.CSV}
                  />
                  <Button type="submit">
                    Upload
                  </Button>
                </form>
              </Popup>
              {state.active && (
                <Button
                  type={"button"}
                  bgColor={""}
                  handleClick={() => setShowDelete(true)}
                >
                  Delete Questions
                </Button>
              )}
              {!state.active && <h2>Select Questions to Delete</h2>}
              {showDelete && (
                <Popup isOpen={showDelete} onClose={() => setShowDelete(false)}>
                  <div className={styles.DeletePopup}>
                    <p>Are you sure you want to delete?</p>
                    <div className={styles.DeletePopupBtns}>
                      <Button
                        type={"submit"}
                        handleClick={ onSubmitHandleDelete
                         
                        }
                      >
                        Yes
                      </Button>
                      <Button
                        type={"submit"}
                        handleClick={() => setShowDelete(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </Popup>
              )}
            </div>
          </>
        )}

        {auth.userRole === Roles.USER && (
          <div className={styles.ButtonContainer}>
            <Button
              type={"button"}
              bgColor={""}
              handleClick={() => submitQuiz(moduleId!, state.markedAns)}
            >
              Submit Quiz
            </Button>
            <Popup isOpen={state.open} onClose={() => setOpen(false)}>
              <>
                <h2
                  className={`${
                    state.submitMsg.status === "success"
                      ? styles.Success
                      : styles.Failure
                  }`}
                >
                  {state.submitMsg.message}
                </h2>
                <Button
                  type={"submit"}
                  bgColor={""}
                  handleClick={() => navigate(`/user/courses`)}
                >
                  Go to Courses
                </Button>
              </>
            </Popup>
          </div>
        )}
      </div>
    </>
  );
}
