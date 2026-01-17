import styles from "./Comment.module.css";


export function Comment() {
    return (
        <>

            <div className={styles.outerContainer}>

                <div className={styles.upperContainer}>
                    <p className={`${styles.username} ${styles.info}`}>
                        {
                            /* usernamne */
                        }
                    </p>

                    <p className={`${styles.createdAt} ${styles.info}`}>
                        {
                            /* createdAt */
                        }
                    </p>
                </div>


                <p className={styles.body}>
                    {
                        /* body */
                    }
                </p>

            </div>


        </>
    )
}