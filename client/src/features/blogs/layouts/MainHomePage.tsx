import { useNavigate } from "react-router-dom";
import styles from "./MainHomePage.module.css";


export function MainHomePage() {

    


    return (
        <>
        
            <div className={styles.outerContainer}>

                <div className={styles.introContainer}>
                    <h2>
                        Welcome to my blog project home page
                    </h2>

                    <p>
                        Please select from one of the given blogs below to read more about it, and don't forget to sign in to leave a comment!!!
                    </p>

                </div>




                <div className={styles.currBlogSection}>




                </div>

                <div className={styles.blogListScrollerSection}>



                </div>



            </div>
        
        
        </>
    )
}