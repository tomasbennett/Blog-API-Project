import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ensureAuthentication } from "../auth/ensureAuthentication";
import { prisma } from "../db/prisma";
import { IBlogsArrayResponse, ISingleBlogResponse } from "../../../shared/features/blogs/models/IBlogsArrayResponse";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";
import { deleteSupaBaseFile } from "../services/DeleteFileSupabase";
import { IComment } from "../../../shared/features/comments/models/ICommentResponse";
import { IBlogsWithoutComments, IBlogsWithoutCommentsResponse } from "../../../shared/features/blogs/models/IBlogsHomePage";

export const router = Router();

router.get("/blogs", ensureAuthentication, async (req: Request, res: Response<ICustomErrorResponse | IBlogsWithoutCommentsResponse>, next: NextFunction) => {

    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                blogImgFile: true
            }
        });

        if (!blogs) {
            const unableToFindBlogs: ICustomErrorResponse = {
                ok: false,
                status: 400,
                message: "We were unable to find the blogs from the server side!!!"
            }

            return res.status(unableToFindBlogs.status).json(unableToFindBlogs);
        }


        const response: IBlogsWithoutCommentsResponse = {
            ok: true,
            status: 200,
            message: "Successfully returning all blogs",
            blogs: blogs.map((blog) => {
                return {
                    id: blog.id,
                    title: blog.title,
                    body: blog.body,
                    createdAt: blog.createdAt,
                    username: blog.user.username,
                    supabaseFileImgId: blog.blogImgFile.supabaseFileId
                }
            })
        }

        return res.status(response.status).json(response);


    } catch (error) {
        return next(error);

    }

});

router.get("/blogs/:blogId", ensureAuthentication, async (req: Request<{ blogId: string }>, res: Response<ICustomErrorResponse | ISingleBlogResponse>, next: NextFunction) => {
    const { blogId } = req.params;

    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId
        },
        include: {
            user: true,
            blogImgFile: true,
            comments: {
                include: {
                    user: true
                }
            }
        }
    });

    if (!blog) {
        const noBlogFound: ICustomErrorResponse = {
            ok: false,
            status: 400,
            message: "No blog found with the blog Id passed into the server!!!"
        }

        return res.status(noBlogFound.status).json(noBlogFound);
    }


    const blogResponse: ISingleBlogResponse = {
        ok: true,
        status: 200,
        message: "Successfully found the blog!!!",
        blog: {
            id: blog.id,
            title: blog.title,
            body: blog.body,
            createdAt: blog.createdAt,
            supabaseFileImgId: blog.blogImgFile.supabaseFileId,
            username: blog.user.username,
            comments: blog.comments.map((comment) => {
                return {
                    id: comment.id,
                    username: comment.user.username,
                    body: comment.body,
                    createdAt: comment.createdAt
                }
            })
        }
    }

    return res.status(blogResponse.status).json(blogResponse);




});




router.delete("/blog/:blogId", ensureAuthentication, async (req: Request<{ blogId: string }>, res: Response<ICustomErrorResponse>, next: NextFunction) => {
    const { blogId } = req.params;
    const user = req.user!;


    try {
        const blogToDelete = await prisma.blog.findUnique({
            where: {
                id: blogId
            },
            include: {
                blogImgFile: true,
                user: true
            }
        });


        if (!blogToDelete) {
            const blogNotFoundError: ICustomErrorResponse = {
                ok: false,
                status: 400,
                message: "Blog to delete not found!!!"
            }
            return res.status(blogNotFoundError.status).json(blogNotFoundError);
        }


        if (blogToDelete.userId !== user.id) {
            const forbiddenError: ICustomErrorResponse = {
                ok: false,
                status: 403,
                message: "You are not authorized to delete this blog as you are not signed in as the user who posted it!!!"
            }

            return res.status(forbiddenError.status).json(forbiddenError);
        }


        //SHOULD WORK BECAUSE OF ONDELETE CASCADE FROM DELETING A FILE
        const deleteBlogAndFile = await deleteSupaBaseFile(blogToDelete.blogImgFileId);

        if (!(deleteBlogAndFile.ok)) {
            return res.status(deleteBlogAndFile.status).json(deleteBlogAndFile);
        }

        return res.sendStatus(204);




        
    } catch (error) {
        next(error);


    }


});