import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { usernamePasswordSchema } from "../../auth/models/ILoginSchema";
import { usernamePasswordRegex } from "../../auth/constants";
import { blogRegex } from "../constants";


export const BlogSchema = z.object({
    id: z.string({ message: "Blog should have a string Id!!!" }),
    title: z.string({ message: "Blog title should be of type string!!! "})
        .min(1, { message: "Blog titles should have a minimum length of 1!!!" })
        .max(50, { message: "Blog titles should have a maximum character length of 50" })
        .regex(blogRegex, {
            message: "This contains invalid characters!!!"
        }),
    body: z.string({ message: "Blog body messages should be of type string" })
        .min(1, { message: "Blog bodies should have a minimum length of 1!!!" })
        .max(600, { message: "Blog titles should have a maximum character length of 300" })
        .regex(blogRegex, {
            message: "This contains invalid characters!!!"
        }),
    createdAt: DateFromStringSchema,
    username: usernamePasswordSchema,

});


export type IBlog = z.infer<typeof BlogSchema>;



export const BlogsArrayResponseSchema = APISuccessSchema.extend({
    blogs: z.array(BlogSchema.extend({
        supabaseFileImgId: z.string({ message: "Each blog response must come with a supabase file Id for the image!!!" })
    }))
});

export type IBlogsArrayResponse = z.infer<typeof BlogsArrayResponseSchema>;