import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../auth/ensureAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";
import { prisma } from "../db/prisma";
import { IAdminReq } from "../../../shared/features/admin/models/IAdminReq";

export const router = Router();


router.post("/admin/create", ensureAuthentication, async (req: Request<{}, {}, IAdminReq>, res: Response<ICustomErrorResponse | ICustomSuccessMessage>, next: NextFunction) => {
    const user = req.user!;
    const { adminSecret } = req.body;

    try {

        const serverSecret = process.env.ADMIN_SECRET;

        if (!serverSecret || adminSecret !== serverSecret) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "Invalid admin secret!!!"
            });
        }



        if (user.role === "ADMIN") {
            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Admin access already granted."
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                role: "ADMIN"
            }
        });


        if (!updatedUser) {
            const unableToPromoteError: ICustomErrorResponse = {
                ok: false,
                status: 500,
                message: "Unable to promote user to admin."
            }
            return res.status(unableToPromoteError.status).json(unableToPromoteError);
        }



        return res.status(201).json({
            ok: true,
            status: 201,
            message: "User promoted to admin successfully."
        });




    } catch (error) {
        return next(error);
    }

});
