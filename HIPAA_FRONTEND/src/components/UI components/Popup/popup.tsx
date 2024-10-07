import styles from "./popup.module.scss";

const Popup = ({ isOpen, onClose, children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.Popup}>
      <div className={styles.PopupInner}>
        {children}
        <div 
        className={styles.CloseBtn}
        onClick={() => onClose()}>
          X
        </div>
      </div>
    </div>
  );
};

export default Popup;
