import z from "zod";
import { BlogSchema } from "./IBlogsArrayResponse";


export const NewBlogReqSchemaServer = BlogSchema.omit({
    username: true, 
    createdAt: true,
    id: true,
    comments: true
});



export type INewBlogReqServer = z.infer<typeof NewBlogReqSchemaServer>;