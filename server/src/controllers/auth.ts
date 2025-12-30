import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";

export const router = Router();

router.get("/auth/check", (req: Request, res: Response<ICustomErrorResponse | ICustomSuccessMessage>, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.status(200).json({ message: "Authenticated" });

    } else {
        res.status(401).json({ message: "Not authenticated" });

    }
});


//SO WE WANT TO SAY SEND IN YOUR ACCESS TOKEN PLEASE
//IF WE GET YOUR ACCESS TOKEN EITHER IT WORKS IN WHICH CASE SUCCESS OR IT ISN'T THERE OR IS INVALID
//SHOULD IT WORK YOU ARE AUTHENTICATED ALWAYS
//SHOULD IT NOT WORK SEND BACK EITHER AN ERROR OCCURRED OR AN INVALID/NO HEADER SENT RESPONSE OR FINALLY SEND BACK AN EXPIRED RESPONSE
//IN THE EXPIRED RESPONSE OR I GUESS IN THE INVALID RESPONSE ON THE FRONTEND CONTACT AN API TO GET A NEW ACCESS TOKEN
//IF THAT RETURNS WITH AN ACCESS TOKEN THEN PROCEED TO THE CONTENTS PAGE
//IF IT RESPONDS WITH AN ERROR FROM THE GENERATE ACCESS TOKEN API THEN WE WILL NEED TO GO TO THE LOGIN WITH THE ERROR