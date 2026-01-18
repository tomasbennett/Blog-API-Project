import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ISingleBlogPageContext } from "../models/ISingleBlogContext"
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse"
import { BlogsArrayResponseSchema, SingleBlogResponseSchema } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse"
import { notExpectedFormatError, jsonParsingError } from "../../../constants/constants"
import { basicResponseHandle } from "../../../services/BasicResponseHandle"
import { domain } from "../../../services/EnvironmentAPI"

export function RandomBlog() {


    const {
        setBlog,
        setIsLoading,
        setIsError,
        setComments
    } = useOutletContext<ISingleBlogPageContext>()


    const navigate = useNavigate();

    useEffect(() => {


        async function fetchRandomBlog() {

            try {
                setIsLoading(true);
                setIsError(null);
                setBlog(null);
    
                const response = await basicResponseHandle(
                    `${domain}/api/blogs`,
                    {
                        method: "GET",

                    },
                    navigate,
                    setIsError
                );
    
    
                if (!response) {
                    return;
                }
    
                
                const resJson = await response.json();
    
                const blogResult = BlogsArrayResponseSchema.safeParse(resJson);
                if (blogResult.success) {
                    const randomIndx: number = Math.floor(Math.random() * blogResult.data.blogs.length);

                    /* CHECK IF THERE ARE BLOGS THROUGH THE LENGTH OF THE ARRAY BEING GREATER THAN ZERO */
                    const selectedBlogId: string = blogResult.data.blogs[randomIndx].id;

                    // setBlog(blogResult.data.blogs[randomIndx]);
                    navigate(`/blog/${selectedBlogId}`, { replace: true })
                    return;

                }
    
    
                const customErrorResult = APIErrorSchema.safeParse(resJson);
                if (customErrorResult.success) {
                    setIsError(customErrorResult.data);
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

        fetchRandomBlog();


    }, []);


    return (
        <>
        
        
        
        
        </>
    )
}