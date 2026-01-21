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
import { jsonParsingError, mediumScreenMaxWidth, notExpectedFormatError, thinScreenMaxWidth, wideScreenMINWidth } from "../../../constants/constants";
import { formatDateUS } from "../../../services/DateFormatter";
import { AddCommentForm } from "../components/AddCommentForm";
import { IComment } from "../../../../../shared/features/comments/models/ICommentResponse";
import { Comment } from "../components/Comment";
import { useAuth } from "../../../context/useAuthLevel";
import { useMediaQuery } from "react-responsive";






export function SingleBlogLayout() {



    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);

    const [blog, setBlog] = useState<IBlog | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);

    const {
        userAuth
    } = useAuth();



    const ctx: ISingleBlogPageContext = {
        setBlog,
        setIsLoading,
        setIsError,
        setComments
    }

    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });
    const isWideScreen: boolean = useMediaQuery({ minWidth: wideScreenMINWidth + 1 });


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

                        <>
                        
                        
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

                            {
                                userAuth.authLevel.commentPermission ?
                                    <div className={styles.addCommentFormContainer}>

                                        <AddCommentForm blogId={blog.id} setComments={setComments} />

                                    </div>
                                :
                                    comments.length > 0 ?

                                    <div className={styles.noAddCommentFormContainer}>
                                        <p className={styles.noAddCommentForm}>
                                            Check out some of these comments...
                                        </p>
                                    </div>

                                    :

                                    null
                            }


                            <div className={styles.commentsContainer}>

                                {
                                    comments.length > 0 &&

                                        comments.map((comment, indx) => {
                                            return (
                                                <Comment key={comment.id} comment={comment} />
                                            )
                                        })
                                }
                                

                            </div>
                        </>


                    :

                        null

                }
                            
            </div>



        
        </>
    )
}