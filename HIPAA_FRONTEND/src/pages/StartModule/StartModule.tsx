import {  useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/UI components/Button/button'
import styles from './StartModule.module.scss'

export default function StartModule(){
  const navigate=useNavigate();
  const {moduleId} = useParams()

    return <div className={styles.StartModule}>
        <div className={styles.StartModuleHeader}>
        <Button text={'Attempt Quiz'} type={'submit'} bgColor={''} handleClick={()=>navigate(`/user/${moduleId}/quiz`) }></Button>
        </div>
        <div className={styles.VideoPlayer}>
            <h2>Module Name</h2>
           <iframe 
                src="https://www.youtube.com/embed/tgbNymZ7vqY" className={styles.ModulePlayer}></iframe> 
        </div>

    </div>
}