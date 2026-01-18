import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../auth/ensureAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { CommentRequestSchemaServer, ICommentRequestServer } from "../../../shared/features/comments/models/ICommentRequest";
import { prisma } from "../db/prisma";
import { ICommentResponse } from "../../../shared/features/comments/models/ICommentResponse";

export const router = Router();


router.post("/comment", ensureAuthentication, async (req: Request<{}, {}, ICommentRequestServer>, res: Response<ICustomErrorResponse | ICommentResponse>, next: NextFunction) => {
    const comment = req.body;
    const user = req.user!;

    
    const bodyResult = CommentRequestSchemaServer.safeParse(comment);
    if (!(bodyResult.success)) {
        const notCorrectBody: ICustomErrorResponse = {
            ok: false,
            status: 400,
            message: `This post request is not valid: ${bodyResult.error.issues[0].message}`
        }
        
        return res.status(notCorrectBody.status).json(notCorrectBody);
    }




    try {
        const newComment = await prisma.comment.create({
            data: {
                body: comment.body,
                blogId: comment.blogId,
                userId: user.id
            },
            include: {
                user: true
            }
        });
    
    
        const response: ICommentResponse = {
            ok: true,
            status: 201,
            message: "Comment has been created successfully!!!",
            comment: {
                body: newComment.body,
                createdAt: newComment.createdAt,
                username: newComment.user.username,
                id: newComment.id
            }
        }

        return res.status(response.status).json(response);



        
    } catch (error) {
        next(error);


    }

});