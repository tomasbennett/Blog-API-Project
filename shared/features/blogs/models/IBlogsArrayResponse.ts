import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";


export const BlogSchema = z.object({
    id: z.string({ message: "Blog should have a string Id!!!" }),
    title: z.string({ message: "Blog title should be of type string!!! "})
        .min(1, { message: "Blog titles should have a minimum length of 1!!!" })
        .max(50, { message: "Blog titles should have a maximum character length of 50" }),
    body: z.string({ message: "Blog body messages should be of type string" })
        .min(1, { message: "Blog bodies should have a minimum length of 1!!!" })
        .max(300, { message: "Blog titles should have a maximum character length of 300" }),
    createdAt: DateFromStringSchema
});


export type IBlog = z.infer<typeof BlogSchema>;



export const BlogsArrayResponseSchema = APISuccessSchema.extend({
    blogs: z.array(BlogSchema.extend({
        username: z.string({ message: "The blogs should each have a user with a username of type string!!!" })
    }))
});

export type IBlogsArrayResponse = z.infer<typeof BlogsArrayResponseSchema>;