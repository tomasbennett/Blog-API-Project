import z from "zod";


export const AdminReqSchema = z.object({
    adminSecret: z.string({ message: "The admin secret code must be a string!!!" })
});


export type IAdminReq = z.infer<typeof AdminReqSchema>;