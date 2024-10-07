

export interface CertificateInputs {
  certificateCSV: FileList;
}

export interface State {
  name: string;
  videoName: string;
  videoUrl: string;
  questionsPerQuiz: number;
  minMarks: number;
}
export interface EditModuleInputs {
  name: string;
  videoName: string;
  videoUrl: string;
  questionsPerQuiz: number;
  minMarks: number;
  questionsCSV: FileList
}
export interface EditModuleProps {
  _id: string;
  name: string;
  videoName: string;
  videoUrl: string;
  minMarks: number;
  questionsPerQuiz: number;
  showModule?: boolean;
  setShowModule: React.Dispatch<React.SetStateAction<boolean>>;
}



