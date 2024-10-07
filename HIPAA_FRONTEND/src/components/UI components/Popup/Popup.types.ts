interface PopupProps {
  isOpen: boolean;
  onClose: (
    datepicker: boolean
  ) => void | React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
}
