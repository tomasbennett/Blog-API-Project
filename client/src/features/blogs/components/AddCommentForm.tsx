import styles from "./AddCommentForm.module.css"

export function AddCommentForm() {

    return (
        <>
        
            <div className={styles.outerContainer}>

                <form className={styles.form}>

                    <h2 className={styles.formHeader}>
                        Leave a comment
                    </h2>

                    <div className={styles.labelInputContainer}>
                        <label htmlFor="add-comment">Add Comment</label>
                        <input placeholder="Add Comment here..." type="text" id="add-comment" />
                    </div>

                    <button className={styles.submitBtn} type="submit">
                        Post Comment
                    </button>

                </form>


            </div>
        
        
        </>
    )
}