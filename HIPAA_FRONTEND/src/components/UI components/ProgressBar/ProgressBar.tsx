import styles from "./ProgressBar.module.scss"; 
import { ProgressBarProps } from "./ProgressBar.types.ts";

const ProgressBar = ({progress}: ProgressBarProps) => { 
       
    return (
        <div className={styles.ProgressBar}>
            <div style={{width: `${progress}%`}} className={styles.Child}>
                <span className={styles.ProgressText}>{`${progress}%`}</span>
            </div>
        </div>
    )
} 
 
export default ProgressBar 
