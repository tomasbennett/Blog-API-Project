import { useNavigate } from "react-router-dom";
import { IBlog } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { formatDateUS } from "../../../services/DateFormatter";
import { domain } from "../../../services/EnvironmentAPI";
import styles from "./MainBlog.module.css";

type IMainBlogProps = {
    blog: IBlog
}


export function MainBlog({
    blog
}: IMainBlogProps) {


    const navigate = useNavigate();


    const onView = () => {
        navigate(`/blog/${blog.id}`, { replace: true })
    }

    const onDel = () => {

    }



    return (
        <>
        
            <div className={styles.outerContainer}>

                <div className={styles.imgContainer}>
                    <img src={`${domain}/api/inline-file/${blog.id}`} alt={`Main Image: ${blog.title}`} />
                </div>

                <div className={styles.lowerTextContainer}>

                    <div className={styles.upperTextContainer}>

                        <h3 className={styles.blogTitle}>
                            {blog.title}
                        </h3>

                        <div className={styles.btnContainer}>

                            <button onClick={onView} className={`${styles.btn} ${styles.viewBtn}`} type="button">
                                View
                            </button>

                            <button onClick={onDel} className={`${styles.btn} ${styles.delBtn}`} type="button">
                                Delete
                            </button>

                        </div>


                    </div>


                    <div className={styles.middleTextContainer}>

                        <p className={styles.username}>
                            {blog.username}
                        </p>

                        <p className={styles.createdAt}>
                            {formatDateUS(blog.createdAt)}
                        </p>

                    </div>


                    <p className={styles.blogDesc}>
                        {blog.body}
                    </p>


                </div>

            </div>
        
        
        
        </>
    )
}