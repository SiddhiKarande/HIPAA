import styles from "./Module.module.scss";
import { ModuleProps } from "./Module.types.ts";
import { CSS } from "@dnd-kit/utilities";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import Button from "../../../UI components/Button/button.tsx";
import { Roles } from "../../../../constants.ts";
import { useAuth } from "../../../../pages/Login/authcontext.tsx";
import EditModule from "../EditModule/EditModule.tsx";
import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { AdminCourseContext } from "../../../../pages/AdminCourses/AdminCourseContext.tsx";
import Popup from "../../../UI components/Popup/popup.tsx";
import { toast } from "react-toastify";
import { checkCompletionStatus } from "../../../../services/Module.service.ts";
import { TiTick } from "react-icons/ti";

const Module = ({
  _id,
  name,
  videoName,
  videoUrl,
  minMarks,
  questionsPerQuiz,
}: ModuleProps) => {
  const auth = useAuth()!;
  const { state, handleDeleteModule } = useContext(AdminCourseContext)!;
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [showDeleteModule, setShowDeleteModule] = useState(false);
  const [completed, setCompleted] = useState(false);
  const toggle = (id: string) => {
    if (selected === id) {
      return setSelected(null);
    }
    setSelected(_id);
  };

  const getCompletedModulesFromAPI = async () => {
    try {
      const response = await checkCompletionStatus(_id);
      setCompleted(response);
    } catch (error) {
      toast.error("Error fetching completed Modules!!");
    }
  };

  useEffect(() => {
    if (
      auth.userRole === Roles.USER &&
      state.enrollmentStatus !== "unenrolled"
    ) {
      getCompletedModulesFromAPI();
    }
  }, [state.progress]);

  const editModuleBtn = (
    <>
      <Button
        type={"submit"}
        bgColor={""}
        handleClick={() => {
          setShowModule(true);
        }}
      >
        Edit Module
      </Button>
      <Button
        type={"submit"}
        bgColor={""}
        handleClick={() => {
          setShowDeleteModule(true);
        }}
      >
        Delete Module
      </Button>
    </>
  );
  const attemptQuizBtn = (
    <Button
      type={"submit"}
      bgColor={""}
      handleClick={() => {
        if (state.enrollmentStatus === "enrolled") {
          navigate(`/user/${_id}/quiz`);
        } else {
          toast.warning("You need to Enroll first");
        }
      }}
    >
      Attempt Quiz
    </Button>
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: _id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={styles.Module}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Popup isOpen={showModule} onClose={() => setShowModule(false)}>
        <EditModule
          name={name}
          videoName={videoName}
          videoUrl={videoUrl}
          minMarks={minMarks}
          questionsPerQuiz={questionsPerQuiz}
          _id={_id}
          showModule={showModule}
          setShowModule={setShowModule}
        />
      </Popup>
      <Popup
        isOpen={showDeleteModule}
        onClose={() => setShowDeleteModule(false)}
      >
        <div className={styles.DeletePopup}>
          <p>Are you sure you want to delete?</p>
          <div className={styles.DeletePopupBtns}>
            <Button type={"submit"} handleClick={() => handleDeleteModule(_id)}>
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
      </Popup>
      <div onClick={() => toggle(_id)} className={styles.ModuleName}>
        <h1 className={styles.Header}>{name}</h1>
        <div className={styles.RightDiv}>
          {auth.userRole === Roles.USER && completed && (
            <TiTick className={styles.TickIcon} size={20} />
          )}
          <span className={styles.Accordian}>
            {selected === _id ? (
              <FaAngleUp style={{ color: "#2196f3" }} />
            ) : (
              <FaAngleDown style={{ color: "#2196f3" }} />
            )}
          </span>
        </div>
      </div>
      <div
        className={
          selected === _id ? styles.ModuleInfoVisible : styles.ModuleInfo
        }
      >
        <div className={styles.Para}>
          <span className={styles.ModuleItem}>Video title :</span>
          <span className={styles.ModuleItemValue}>{videoName}</span>
        </div>
        {auth.userRole === Roles.USER ? (
          <div className={styles.VideoContainer}>
            <span className={styles.ModulePlayer}>
              <iframe
                className={styles.Iframe}
                src={videoUrl.replace("/watch?v=", "/embed/")}
              ></iframe>
            </span>
          </div>
        ) : null}

        {auth.userRole === Roles.ADMIN && (
          <div className={styles.Para}>
            <span className={styles.ModuleItem}>VideoUrl :</span>
            <span className={styles.ModuleItemValue}>
              <a href={`${videoUrl}`} target="_blank">
                {videoUrl}
              </a>
            </span>
          </div>
        )}
        <div className={styles.ModuleFooter}>
          <div className={styles.Para}>
            <span className={styles.ModuleItem}>Minimum Passing Marks: </span>
            <span className={styles.ModuleItemValue}>{minMarks}</span>
          </div>
          <div className={styles.Para}>
            <span className={styles.ModuleItem}>No Of Questions: </span>
            <span className={styles.ModuleItemValue}>{questionsPerQuiz}</span>
          </div>

          {selected === _id && (
            <div className={styles.EditButton}>
              {auth.userRole === Roles.ADMIN && editModuleBtn}
              {auth.userRole === Roles.USER && attemptQuizBtn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module;
