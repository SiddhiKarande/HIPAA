export interface UserProfileProps {
}

export type CourseStatusType = "enrolled" | "unenrolled" | "completed";

export interface UserProfileReducerState {
  pictureUrl: string | undefined;
  firstName: string,
  lastName: string,
  email: string,
  designation: string,
  department: string,
  employeeId: number,
  enrollments: EnrollmentProps[],
}

export interface EnrollmentProps {
  status: string;
  certificationValidTill: string;
  _id: string;
}