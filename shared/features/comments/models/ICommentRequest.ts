import z from "zod";
import { commentRegex, maxCommentLength, minCommentLength } from "../constants";


export const CommentBody = z
    .string({ message: "A comment must be of type string!!!" })
    .min(minCommentLength, { message: `Comments must have a minimum length of: ${minCommentLength}` })
    .max(maxCommentLength, { message: `Comments must have a maximum length of: ${maxCommentLength}`})
    .regex(commentRegex, { message: `This comment contains characters that aren't valid!!!` })



export const CommentRequestSchemaClient = z.object({
    body: CommentBody
});


export type ICommentRequestClient = z.infer<typeof CommentRequestSchemaClient>;






export const CommentRequestSchemaServer = CommentRequestSchemaClient.extend({
    blogId: z.string({ message: "Comments must contain a blog Id that is missing!!!" })
});



export type ICommentRequestServer = z.infer<typeof CommentRequestSchemaServer>;


