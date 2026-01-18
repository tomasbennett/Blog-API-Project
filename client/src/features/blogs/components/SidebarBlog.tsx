import { IBlog } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { IBlogsWithoutComments } from "../../../../../shared/features/blogs/models/IBlogsHomePage";
import { domain } from "../../../services/EnvironmentAPI";
import styles from "./SidebarBlog.module.css";


type ISidebarBlogProps = {
    blog: IBlogsWithoutComments
}

export function SidebarBlog({
    blog
}: ISidebarBlogProps) {

    return (
        <>
        
            <div className={styles.outerContainer}>

                <div className={styles.imgContainer}>
                    <p className={styles.usernameContainer}>
                        {blog.username}
                    </p>

                    <img src={`${domain}/api/inline-file/${blog.id}`} alt={`${blog.title}: Image`} />


                </div>

                <p className={styles.blogTitle}>
                    {blog.title}
                </p>

            </div>
        
        </>
    )
}