import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { CommentBody } from "./ICommentRequest";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { usernamePasswordSchema } from "../../auth/models/ILoginSchema";

export const CommentSchema = z.object({
    body: CommentBody,
    username: usernamePasswordSchema,
    createdAt: DateFromStringSchema,
    id: z.string({ message: "A comment must have an id that is of type string!!! "})
});

export type IComment = z.infer<typeof CommentSchema>;






export const CommentResponseSchema = APISuccessSchema.extend({
    comment: CommentSchema
});

export type ICommentResponse = z.infer<typeof CommentResponseSchema>;