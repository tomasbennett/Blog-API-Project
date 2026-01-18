import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { usernamePasswordSchema } from "../../auth/models/ILoginSchema";
import { blogRegex, maxBlogBodyLength, maxBlogTitleLength, minBlogBodyLength, minBlogTitleLength } from "../constants";
import { CommentSchema } from "../../comments/models/ICommentResponse";


export const BlogSchema = z.object({
    id: z.string({ message: "Blog should have a string Id!!!" }),
    title: z.string({ message: "Blog title should be of type string!!! "})
        .min(minBlogTitleLength, { message: "Blog titles should have a minimum length of 1!!!" })
        .max(maxBlogTitleLength, { message: "Blog titles should have a maximum character length of 50" })
        .regex(blogRegex, {
            message: "This contains invalid characters!!!"
        }),
    body: z.string({ message: "Blog body messages should be of type string" })
        .min(minBlogBodyLength, { message: "Blog bodies should have a minimum length of 1!!!" })
        .max(maxBlogBodyLength, { message: "Blog titles should have a maximum character length of 300" })
        .regex(blogRegex, {
            message: "This contains invalid characters!!!"
        }),
    createdAt: DateFromStringSchema,
    username: usernamePasswordSchema,
    comments: z.array(CommentSchema, { message: "A blog should have an array of comments!!!" })
});


export type IBlog = z.infer<typeof BlogSchema>;



export const BlogsArrayResponseSchema = APISuccessSchema.extend({
    blogs: z.array(BlogSchema.extend({
        supabaseFileImgId: z.string({ message: "Each blog response must come with a supabase file Id for the image!!!" })
    }))
});

export type IBlogsArrayResponse = z.infer<typeof BlogsArrayResponseSchema>;



export const SingleBlogResponseSchema = APISuccessSchema.extend({
    blog: BlogSchema.extend({
        supabaseFileImgId: z.string({ message: "A blog response must come with a supabase file Id for the image!!!" })
    })
});


export type ISingleBlogResponse = z.infer<typeof SingleBlogResponseSchema>;