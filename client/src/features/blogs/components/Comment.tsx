import { IComment } from "../../../../../shared/features/comments/models/ICommentResponse";
import { formatDateUS } from "../../../services/DateFormatter";
import styles from "./Comment.module.css";


type ICommentProps = {
    comment: IComment
}

export function Comment({
    comment
}: ICommentProps) {
    return (
        <>

            <div className={styles.outerContainer}>

                <div className={styles.upperContainer}>
                    <p className={`${styles.username} ${styles.info}`}>
                        {
                            comment.username
                        }
                    </p>

                    <p className={`${styles.createdAt} ${styles.info}`}>
                        {
                            formatDateUS(comment.createdAt)
                        }
                    </p>
                </div>


                <p className={styles.body}>
                    {
                        comment.body
                    }
                </p>

            </div>


        </>
    )
}