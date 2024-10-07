import { useContext, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { CertifiedContext } from "../../../pages/Certified/CertifiedContext";
import Popup from "../Popup/popup";
import Button from "../Button/button";
import { useForm } from "react-hook-form";
import { FileUploaderProps } from "./FileUploader.types";

const FileUploader = ({ enrollment_id }: FileUploaderProps) => {
  const { replaceCertificate } = useContext(CertifiedContext)!;
  const { register, handleSubmit } = useForm();
  const [active,setctive]=useState(false)
  const handlereplace = async (data: { certificate: FileList }) => {
    await replaceCertificate(data, enrollment_id);
    setctive(false)
  };

  return (
    <div>
      <MdFileUpload
        color="rgb(33, 150, 243)"
        size={20}
        onClick={() => {
          setctive(true);
        }}
      />
      <Popup isOpen={active} onClose={() => setctive(false)}>
        <form onSubmit={handleSubmit(handlereplace)}>
          <input type="file" {...register("certificate")} />
          <Button type="submit" bgColor="">
            Upload
          </Button>
        </form>
      </Popup>
    </div>
  );
};

export default FileUploader;
