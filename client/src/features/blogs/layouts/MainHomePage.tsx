import { useNavigate } from "react-router-dom";
import styles from "./MainHomePage.module.css";
import { useEffect, useMemo, useState } from "react";
import { BlogsArrayResponseSchema, IBlog, IBlogsArrayResponse } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants";
import { SidebarBlog } from "../components/SidebarBlog";
import { MainBlog } from "../components/MainBlog";
import { BlogsWithoutCommentsResponseSchema, IBlogsWithoutComments } from "../../../../../shared/features/blogs/models/IBlogsHomePage";


export function MainHomePage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null)

    const [currBlog, setCurrBlog] = useState<IBlogsWithoutComments | null>(null);
    const [allBlogsArr, setAllBlogsArr] = useState<IBlogsWithoutComments[] | null>(null);

    const navigate = useNavigate();



    useEffect(() => {

        const getBlogs = async () => {
            setIsError(null);
            setIsLoading(true);

            const response = await basicResponseHandle(
                `${domain}/api/blogs`,
                {
                    method: "GET"
                },
                navigate,
                setIsError
            );

            if (response === null) {
                return;
            }

            try {

                const blogsJson = await response.json();

                const blogsResult = BlogsWithoutCommentsResponseSchema.safeParse(blogsJson);
                if (blogsResult.success) {
                    setAllBlogsArr(blogsResult.data.blogs);
                    setCurrBlog(blogsResult.data.blogs?.[0] ?? null);
                    return;

                }

                const errorResult = APIErrorSchema.safeParse(blogsJson);
                if (errorResult.success) {
                    setIsError(errorResult.data);
                    return;
                }

                setIsError(notExpectedFormatError);
                return;


            } catch (error) {
                setIsError(jsonParsingError);
                return;


            } finally {
                setIsLoading(false);


            }

        }

        getBlogs();

    }, []);


    useEffect(() => {
        console.log("BLOGS ARRAY HAS CHANGED: ");
        console.dir(allBlogsArr);
        
    }, [allBlogsArr]);


    const blogsLength: number = useMemo(() => {
        if (allBlogsArr) {
            return allBlogsArr.length;
        }

        return 0;
    }, [allBlogsArr]);




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

                    {
                        currBlog ?

                            <MainBlog setAllBlogsArr={setAllBlogsArr} blog={currBlog} />

                        :

                            <p className={styles.noCurrBlog}>
                                There are no blogs currently available
                            </p>
                    }




                </div>

                <div className={styles.blogListScrollerSection}>

                    {
                        blogsLength > 0 && currBlog ?

                            allBlogsArr!.map((blog, indx) => {

                                return (
                                    <SidebarBlog setCurrBlog={setCurrBlog} currBlog={currBlog} blog={blog} key={blog.id} />
                                )
                            })


                        :

                        <p>There are no blogs currently</p>
                    }

                </div>



            </div>
        
        
        </>
    )
}