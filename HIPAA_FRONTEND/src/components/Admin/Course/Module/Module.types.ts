export interface ModuleProps {
  _id: string;
  name: string;
  videoName: string;
  videoUrl: string;
  minMarks: number;
  questionsPerQuiz: number;
  enrolled:boolean
  sequenceNumber:number
}

export interface ModuleProp {
  id: string;
  _id: string;
  name: string;
  videoName: string;
  videoUrl: string;
  minMarks: number;
  questionsPerQuiz: number;
  sequenceNumber:number;
}
