import { useNavigate } from "react-router-dom";
import { IBlog } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { formatDateUS } from "../../../services/DateFormatter";
import { domain } from "../../../services/EnvironmentAPI";
import styles from "./MainBlog.module.css";
import { IBlogsWithoutComments } from "../../../../../shared/features/blogs/models/IBlogsHomePage";
import { useState } from "react";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants";

type IMainBlogProps = {
    blog: IBlogsWithoutComments,
    setAllBlogsArr: React.Dispatch<React.SetStateAction<IBlogsWithoutComments[] | null>>
}


export function MainBlog({
    blog,
    setAllBlogsArr
}: IMainBlogProps) {


    const navigate = useNavigate();

    const [onDelIsLoading, setOnDelLoading] = useState<boolean>(false);


    const onView = () => {
        navigate(`/blog/${blog.id}`, { replace: true })
    }

    const onDel = async () => {

        try {
            setOnDelLoading(true)

            const response = await formResponseHandler(
                `${domain}/api/blog/${blog.id}`,
                {
                    method: "DELETE"
                },
                navigate
            );

            if (!response) {
                return;
            }

            if (response.type === "customError") {
                alert(response.error.message);
                return;
            }

            if (response.data.status === 204) {
                //SUCCESS FUNCTIONALITY
                setAllBlogsArr(prev => {
                    return prev!.filter((prevBlog) => blog.id !== prevBlog.id)
                });
                return;
            }

            const resJson = await response.data.json();

            const errorResult = APIErrorSchema.safeParse(resJson);
            if (errorResult.success) {
                alert(errorResult.data.message);
                return;
            }

            alert(notExpectedFormatError.message);
            return;


            
        } catch (error) {
            alert(jsonParsingError.message);
            return;


        } finally {
            setOnDelLoading(false);

        }


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
                                {
                                    onDelIsLoading ?
                                        <LoadingCircle height="100%" />

                                        :

                                        "Delete"


                                }


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