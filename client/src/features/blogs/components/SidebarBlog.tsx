import { useMemo } from "react";
import { IBlog } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { IBlogsWithoutComments } from "../../../../../shared/features/blogs/models/IBlogsHomePage";
import { domain } from "../../../services/EnvironmentAPI";
import styles from "./SidebarBlog.module.css";
import { useMediaQuery } from "react-responsive";
import { thinScreenMaxWidth, mediumScreenMaxWidth, wideScreenMINWidth } from "../../../constants/constants";


type ISidebarBlogProps = {
    blog: IBlogsWithoutComments,
    currBlog: IBlogsWithoutComments,
    setCurrBlog: React.Dispatch<React.SetStateAction<IBlogsWithoutComments | null>>
}

export function SidebarBlog({
    blog,
    currBlog,
    setCurrBlog
}: ISidebarBlogProps) {

    const isCurrBlog: boolean = useMemo(() => {
        return currBlog.id === blog.id;
    }, [currBlog]);

    const onSelectBlog = () => {
        if (isCurrBlog) {
            return;
        }

        setCurrBlog(blog);

    }


    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });
    const isWideScreen: boolean = useMediaQuery({ minWidth: wideScreenMINWidth + 1 });

    const blogContainerClassNames: string = useMemo(() => {

        if (isThinScreen) {
            return`${styles.thinOuterContainer}`;
        } else if (isMediumScreen) {
            return `${styles.mediumOuterContainer}`;
        } else {
            return `${styles.wideOuterContainer}`;
        }

    }, [isThinScreen, isMediumScreen, isWideScreen]);


    return (
        <>
        
            <div onClick={onSelectBlog} className={`${blogContainerClassNames} ${styles.outerContainer} ${isCurrBlog && styles.selected}`}>

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