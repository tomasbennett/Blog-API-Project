import { useNavigate } from "react-router-dom";
import styles from "./MainHomePage.module.css";
import { useEffect, useMemo, useState } from "react";
import { BlogsArrayResponseSchema, IBlog, IBlogsArrayResponse } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";
import { jsonParsingError, mediumScreenMaxWidth, notExpectedFormatError, thinScreenMaxWidth, wideScreenMINWidth } from "../../../constants/constants";
import { SidebarBlog } from "../components/SidebarBlog";
import { MainBlog } from "../components/MainBlog";
import { BlogsWithoutCommentsResponseSchema, IBlogsWithoutComments } from "../../../../../shared/features/blogs/models/IBlogsHomePage";
import { useAuth } from "../../../context/useAuthLevel";
import { resolveAuthResponse } from "../../../services/AuthHandler";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { useMediaQuery } from "react-responsive";


export function MainHomePage() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null)

    const [currBlog, setCurrBlog] = useState<IBlogsWithoutComments | null>(null);
    const [allBlogsArr, setAllBlogsArr] = useState<IBlogsWithoutComments[] | null>(null);

    const navigate = useNavigate();

    const {
        userAuth
    } = useAuth();

    useEffect(() => { 
        if (isError) console.error("Main Home Page Error:", isError); 

    }, [isError]);



    useEffect(() => {

        const getBlogs = async () => {
            setIsError(null);
            setIsLoading(true);

            const response = await fetch(
                `${domain}/api/blogs`,
                {
                    method: "GET"
                }
            );

            
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


    const blogsLength: number = useMemo(() => {
        if (allBlogsArr) {
            return allBlogsArr.length;
        }

        return 0;
    }, [allBlogsArr]);





    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });
    const isWideScreen: boolean = useMediaQuery({ minWidth: wideScreenMINWidth + 1 });

    const outerContainerClassNames: string = useMemo(() => {

        if (isThinScreen) {
            return`${styles.thinOuterContainer}`;
        } else if (isMediumScreen) {
            return `${styles.mediumOuterContainer}`;
        } else {
            return `${styles.wideOuterContainer}`;
        }

    }, [isThinScreen, isMediumScreen, isWideScreen]);

    const sidebarContainerClassNames: string = useMemo(() => {
        if (isThinScreen) {
            return`${styles.thinSidebarContainer}`;
        } else if (isMediumScreen) {
            return `${styles.mediumSidebarContainer}`;
        } else {
            return `${styles.wideSidebarContainer}`;
        }

    }, [isThinScreen, isMediumScreen, isWideScreen]);

    return (
        <>

            {
                isLoading ?

                    <div className={styles.loadingContainer}>
                        <LoadingCircle height="8rem" />

                    </div>

                : 
                
                    <div className={`${outerContainerClassNames} ${styles.outerContainer}`}>



                        <div className={styles.introContainer}>
                            <h2>
                                Welcome to my blog project home page
                            </h2>

                            <div className={styles.lowerTextBtnContainer}>
                                <p>
                                    Please select from one of the given blogs below to read more about it, and don't forget to sign in to leave a comment!!!
                                </p>

                                <button onClick={() => {
                                    navigate(userAuth.authLevel.mainMenuNav, { replace: true });
                                }} className={styles.authLevelBtn} type="button">
                                    {
                                        userAuth.authLevel.mainMenuText
                                    }
                                </button>

                            </div>


                        </div>




                        <div className={styles.currBlogSection}>

                            {
                                currBlog && allBlogsArr ?

                                    <MainBlog setCurrBlog={setCurrBlog} allBlogsArr={allBlogsArr} setAllBlogsArr={setAllBlogsArr} blog={currBlog} />

                                :

                                    <p className={styles.noCurrBlog}>
                                        There are no blogs currently available
                                    </p>
                            }




                        </div>

                        <div className={`${sidebarContainerClassNames} ${styles.blogListScrollerSection}`}>

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
                    
            }


        
        
        </>
    )
}