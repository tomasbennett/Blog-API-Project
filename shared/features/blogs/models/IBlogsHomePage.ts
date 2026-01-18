import z from "zod";
import { BlogSchema, BlogsArrayResponseSchema } from "./IBlogsArrayResponse";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";



export const BlogsWithoutComments = BlogSchema.omit({
    comments: true
});



export type IBlogsWithoutComments = z.infer<typeof BlogsWithoutComments>;




export const BlogsWithoutCommentsResponseSchema = APISuccessSchema.extend({
    blogs: z.array(BlogsWithoutComments, { message: "Main page blogs must have an array of blogs!!!" })
});


export type IBlogsWithoutCommentsResponse = z.infer<typeof BlogsWithoutCommentsResponseSchema>;