import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { ISingleBlogPageContext } from "../models/ISingleBlogContext";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { SingleBlogResponseSchema } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse";
import { notExpectedFormatError, jsonParsingError } from "../../../constants/constants";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";

export function SingleBlogFetch() {

    const { blogId } = useParams();



    const {
        setBlog,
        setIsLoading,
        setIsError
    } = useOutletContext<ISingleBlogPageContext>();

    const navigate = useNavigate();

    useEffect(() => {
        
        async function fetchBlog() {

            if (!blogId) {
                setIsError({
                    ok: false,
                    status: 400,
                    message: "No valid blog Id given!!!"
                });
                return
            }

            try {
                setIsLoading(true);
                setIsError(null);
                setBlog(null);
    
                const response = await basicResponseHandle(
                    `${domain}/api/blogs/${blogId}`,
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
    
                const blogResult = SingleBlogResponseSchema.safeParse(resJson);
                if (blogResult.success) {
                    setBlog(blogResult.data.blog);
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

        fetchBlog();
        

    }, []);



    return (
        <>
        
        
        
        </>
    )
}