export interface DatePickerProps{
handleChange:(date:Date|null)=>void;
selectedDate:Date;
}

export type DatePickerType=
  ({ handleChange, selectedDate }: DatePickerProps) => JSX.Element