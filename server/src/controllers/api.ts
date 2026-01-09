import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ensureAuthentication } from "../auth/ensureAuthentication";
import { prisma } from "../db/prisma";
import { IBlogsArrayResponse } from "../../../shared/features/blogs/models/IBlogsArrayResponse";

export const router = Router();

router.get("/blogs", ensureAuthentication, async (req: Request, res: Response<ICustomErrorResponse | IBlogsArrayResponse>, next: NextFunction) => {

    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
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


        const response: IBlogsArrayResponse = {
            ok: true,
            status: 200,
            message: "Successfully returning all blogs",
            blogs: blogs.map((blog) => {
                return {
                    id: blog.id,
                    title: blog.title,
                    body: blog.body,
                    createdAt: blog.createdAt,
                    username: blog.user.username
                }
            })
        }

        return res.status(response.status).json(response);


    } catch (error) {
        return next(error);

    }

});