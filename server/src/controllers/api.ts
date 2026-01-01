import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export const router = Router();

router.get("/random", (req, res, next) => {
    const error: ICustomErrorResponse = {
        ok: false,
        status: 301,
        message: "does this even work"    
    
    }
    return res.status(200).json(error);
})