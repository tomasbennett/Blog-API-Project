import { Outlet, useNavigate } from "react-router-dom";
import styles from "./SingleBlogLayout.module.css";
import { ISingleBlogPageContext } from "../models/ISingleBlogContext";
import { useEffect, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { IBlog, SingleBlogResponseSchema } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants";
import { formatDateUS } from "../../../services/DateFormatter";






export function SingleBlogLayout() {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    const [blog, setBlog] = useState<IBlog | null>(null);


    useEffect(() => {
        console.dir(blog);

    }, [blog])



    const ctx: ISingleBlogPageContext = {
        setBlog,
        setIsLoading,
        setIsError
    }


    return (
        <>
            <Outlet context={ctx} />

            <div className={styles.outerContainer}>

                {
                    isError ?
                        <div className={styles.errorContainer}>
                            <h2>
                                An Error Occurred: {isError.status}
                            </h2>
                            <p>
                                {isError.message}
                            </p>

                        </div>

                    :

                    isLoading ?

                        <LoadingCircle height="6rem" />

                    :


                    blog ?

                        <div className={styles.blogContainer}>

                            <div className={styles.imgContainer}>
                                <img src={`${domain}/api/inline-file/${blog.id}`} alt={`Main Image: ${blog.title}`} />
                            </div>

                            <div className={styles.lowerBlogContainer}>
                                
                                <h2 className={styles.blogTitle}>
                                    {blog.title}
                                </h2>

                                <div className={styles.infoContainer}>

                                    <p className={`${styles.info} ${styles.blogUsername}`}>
                                        {blog.username}
                                    </p>

                                    <p className={`${styles.info} ${styles.blogCreatedAt}`}>
                                        {formatDateUS(blog.createdAt)}
                                    </p>

                                </div>

                                <p className={styles.blogBody}>
                                    {blog.body}
                                </p>

                            </div>

                        </div>

                    :

                        null

                }
                            
            </div>



        
        </>
    )
}