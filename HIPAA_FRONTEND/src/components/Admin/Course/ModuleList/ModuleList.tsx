import styles from "./ModuleList.module.scss";
import { Roles } from "../../../../constants.ts";
import { useContext, useEffect } from "react";
import Module from "../Module/Module.tsx";
import Button from "../../../UI components/Button/button.tsx";
import AddModule from "../AddModule/AddModule.tsx";
import ProgressBar from "../../../UI components/ProgressBar/ProgressBar.tsx";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { ModuleProp } from "../Module/Module.types.ts";
import { useAuth } from "../../../../pages/Login/authcontext.tsx";
import { AdminCourseContext } from "../../../../pages/AdminCourses/AdminCourseContext.tsx";
import Popup from "../../../UI components/Popup/popup.tsx";
import { getUserLoginDataFromToken } from "../../../../services/User.service.ts";
import { ToastContent, toast } from "react-toastify";

const ModuleList = () => {
  const auth = useAuth()!;
  const {
    state,
    enrollUser,
    handleSaveSequence,
    setEnrollmentStatus,
    setProgress,
    setDrag,
    setModuleSequence,
    setShowModule,
  } = useContext(AdminCourseContext)!;

  useEffect(() => {
    if (state.modules) {
      const transformedModules: ModuleProp[] = state.modules.map((module) => ({
        ...module,
        id: module._id,
      }));
      setModuleSequence(transformedModules);
    }
  }, [state.modules,state.enrollmentStatus]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updateModuleSequence = (items: ModuleProp[]) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      };
      const sequence = updateModuleSequence(state.moduleSequence);
      setModuleSequence(sequence);
    }
  }

  async function handleSequence() {
    if (state.drag) {
      await handleSaveSequence(state.moduleSequence);
    }
    setDrag(!state.drag);
  }

  const getUserLoginDataFromTokenAPI = async () => {
    try {
      const response = await getUserLoginDataFromToken();
      if (response.activeEnrollment !== null) {
        await setEnrollmentStatus(response.activeEnrollment.status);
      }
      await setProgress(response.activeEnrollment.progress);
    } catch (error) {
      toast.error(error as ToastContent<string>);
    }
  };

  useEffect(() => {
   { Roles.USER===auth.userRole&&getUserLoginDataFromTokenAPI()}
  }, [state.enrollmentStatus, state.progress]);

  const adminButtons = (
    <>
      <Button
        type={"submit"}
        bgColor={""}
        handleClick={()=>

         setShowModule(true)
        }
      >Add Module</Button>
      <Button
     
        type={"submit"}
        bgColor={""}
        handleClick={() => handleSequence()}
      >{state.drag ? "Save Sequence" : "Change Sequence"}</Button>
    </>
  );

  const userButtons = (
    <>
      {state.enrollmentStatus !== "enrolled" && (
        <Button
          type={"button"}
          handleClick={() => {
            enrollUser();
          }}
        >Enroll</Button>
      )}
    </>
  );

  return (
    <div className={styles.ModuleList}>
      {auth.userRole === Roles.USER &&
        state.enrollmentStatus === "enrolled" && (
          <ProgressBar progress={state.progress} />
        )}
      <div
        className={
          auth.userRole === Roles.ADMIN
            ? styles.SaveSequenceButton
            : styles.UserButtons
        }
      >
        {auth.userRole === Roles.ADMIN && adminButtons}
        {auth.userRole === Roles.USER && userButtons}
      </div>

      <Popup
        isOpen={state.showModule}
        onClose={
          setShowModule
        }
      >
        <AddModule setShowModule={setShowModule} />
      </Popup>
      <div className={styles.ModuleListContainer}>
        {state.drag? (
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={state.moduleSequence}>
              {state.moduleSequence.map((data) => (
                <Module
                  key={data._id}
                  name={data.name}
                  videoName={data.videoName}
                  videoUrl={data.videoUrl}
                  minMarks={data.minMarks}
                  questionsPerQuiz={data.questionsPerQuiz}
                  _id={data._id}
                  enrolled={state.enrollmentStatus === "enrolled"}
                  sequenceNumber={data.sequenceNumber}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          state.modules.map((data) => (
            <Module
              key={data._id}
              name={data.name}
              videoName={data.videoName}
              videoUrl={data.videoUrl}
              minMarks={data.minMarks}
              questionsPerQuiz={data.questionsPerQuiz}
              _id={data._id}
              enrolled={state.enrollmentStatus === "enrolled"}
              sequenceNumber={data.sequenceNumber}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleList;
