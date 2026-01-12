import z from "zod";
import { BlogSchema } from "./IBlogsArrayResponse";
import { NewFileRequestSchema } from "../../files/models/INewFile";
import { NewBlogReqSchemaServer } from "./INewBlogServerReq";


export const NewBlogReqSchema = NewBlogReqSchemaServer.extend({
    blogImgFile: NewFileRequestSchema
});



export type INewBlogReq = z.infer<typeof NewBlogReqSchema>;