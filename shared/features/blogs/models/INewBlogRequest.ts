import z from "zod";
import { BlogSchema } from "./IBlogsArrayResponse";
import { NewFileRequestSchema } from "../../files/models/INewFile";


export const NewBlogReqSchema = BlogSchema.omit({
    username: true, 
    createdAt: true,
    id: true
}).extend({
    blogImgFile: NewFileRequestSchema
});



export type INewBlogReq = z.infer<typeof NewBlogReqSchema>;