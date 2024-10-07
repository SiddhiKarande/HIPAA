import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../UI components/Button/button";
import { EditModuleProps, EditModuleInputs } from "./EditModule.types";
import styles from "./EditModule.module.scss";
import { AdminCourseContext } from "../../../../pages/AdminCourses/AdminCourseContext";
import ModuleForm from "../ModuleForm/ModuleForm.tsx";

const EditModule = ({
  _id,
  name,
  videoName,
  videoUrl,
  minMarks,
  questionsPerQuiz,
  setShowModule
}: EditModuleProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditModuleInputs>();

  const { onSubmitEditModule } = useContext(AdminCourseContext)!;

  useEffect(() => {
    setValue("name", name || "");
    setValue("videoName", videoName || "");
    setValue("videoUrl", videoUrl || "");
    setValue("questionsPerQuiz", questionsPerQuiz || 0);
    setValue("minMarks", minMarks || 0);
  }, []);

  const onSubmit = async (data: EditModuleInputs) => {
    await onSubmitEditModule(data, _id);
    setShowModule(false);
  };

  return (
    <div className={styles.EditModule}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Module</h2>
        <ModuleForm
          register={register}
          errors={errors}
          watch={watch}
          isEditMode={true}
          _id={_id}
        />
        <div className={styles.Btn}>
          <Button
          
            type="submit"
            bgColor="blue"
            handleClick={() => {}}
          >Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default EditModule;
