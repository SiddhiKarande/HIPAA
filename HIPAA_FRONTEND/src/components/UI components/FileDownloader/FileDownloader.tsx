import { downloadPdf } from "../../../services/FileDownload.service";
import { FileDownloaderProps } from "./FileDownloader.types";
import { toast } from "react-toastify";
import { MdFileDownload } from "react-icons/md";
import styles from "./FileDownloader.module.scss"
const FileDownloader = ({ enrollment_id, email }: FileDownloaderProps) => {
  const downloadFile = async (enrollment_id: string, email: string) => {
    try {
      await downloadPdf(enrollment_id, email);
    } catch (error) {
      toast.error("Error downloading PDF")
    }
  };
  const handleclick = () => {
    downloadFile(enrollment_id, email!);
  };
  return (
    <div className={styles.FileDownloader}>
      <MdFileDownload color="rgb(33, 150, 243)" onClick={handleclick} size={20}/>
    </div>
  );
};
export default FileDownloader;
