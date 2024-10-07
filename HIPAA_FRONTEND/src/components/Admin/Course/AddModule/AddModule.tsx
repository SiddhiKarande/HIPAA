import { AddModuleProps, AddModuleInputs } from "./AddModule.types";
import styles from "./AddModule.module.scss";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { AdminCourseContext } from "../../../../pages/AdminCourses/AdminCourseContext";
import ModuleFormFields from "../ModuleForm/ModuleForm";
import Button from "../../../UI components/Button/button";

const AddModule = ({ setShowModule }: AddModuleProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddModuleInputs>();

  const { onAddModule } = useContext(AdminCourseContext)!;

  const onSubmit: SubmitHandler<AddModuleInputs> = async (data) => {
    console.log(data)
    await onAddModule(data);
    setShowModule(false);
  };

  return (
    <div className={styles.AddModule}>
      <form className={styles.AddModuleForm} onSubmit={handleSubmit(onSubmit)}>
        <h2>Add Module</h2>
        <ModuleFormFields
          register={register}
          errors={errors}
          watch={watch}
          isEditMode={false}
        />
        <div className={styles.Btn}>
          <Button
            type="submit"
            bgColor="blue"
            handleClick={() => {}}
          >Add Module</Button>
        </div>
      </form>
    </div>
  );
};

export default AddModule;
