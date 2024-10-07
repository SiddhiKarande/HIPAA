
export interface AddModuleProps {
    setShowModule:(showModule:boolean)=>void;
}

export interface AddModuleInputs {
    name: string;
    videoName: string;
    videoUrl: string;
    questionsPerQuiz: number;
    minMarks: number;
    questionsCSV: FileList;
  }
  