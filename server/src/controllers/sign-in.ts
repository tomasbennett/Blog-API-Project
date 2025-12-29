import { Prisma, User } from "@prisma/client";
import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import passport from "passport";
import { prisma } from "../db/prisma";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto";

import { ensureAuthentication, ensureNotAuthenticated } from "../passport/ensureAuthentication";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";
import { ILoginForm, ISignInError, usernamePasswordSchema } from "../../../shared/features/auth/models/ILoginSchema";
import { environment } from "../../../shared/constants";
import { IAccessTokenResponse } from "../../../shared/features/auth/models/IAccessTokenResponse";



export const router = Router();


router.post("/login", async (req: Request<{}, {}, ILoginForm>, res: Response<ISignInError | IAccessTokenResponse>, next: NextFunction) => {
    const { username, password } = req.body;

    const usernameResult = usernamePasswordSchema.safeParse(username);
    if (!usernameResult.success) {
        return res.status(400).json({
            message: usernameResult.error.issues[0].message,
            inputType: "username"
        });

    }

    const passwordResult = usernamePasswordSchema.safeParse(password);
    if (!passwordResult.success) {
        return res.status(400).json({
            message: passwordResult.error.issues[0].message,
            inputType: "password"
        });
    }


    try {
        const user: User | null = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            const errorResponse: ISignInError = {
                message: "Invalid username!!!",
                inputType: "username"
            };
            return res.status(400).json(errorResponse);
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const errorResponse: ISignInError = {
                message: "Invalid password!!!",
                inputType: "password"
            };
            return res.status(400).json(errorResponse);
        }

        // WE WANT TO CREATE AN ACCESS TOKEN AND A REFRESH TOKEN FOR THE USER SENDING THE REFRESH TOKEN AS A COOKIE AND THE ACCESS TOKEN IN THE RESPONSE BODY
        const accessToken = jwt.sign({
            sub: user.id,
            role: user.role
        }, process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret", {
            expiresIn: '10m'
        });

        const refreshToken = crypto.randomBytes(64).toString('hex');

        const refreshTokenHash = await bcrypt.hash(refreshToken, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);



        const expiry: number = 7 * 24 * 60 * 60 * 1000;

        await prisma.refreshToken.create({
            data: {
                hashedToken: refreshTokenHash,
                userId: user.id,
                expiresAt: new Date(Date.now() + expiry)
            }
        });

        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: environment === "PROD",
                sameSite: environment === "PROD" ? "none" : "lax",
                maxAge: expiry
            })
            .status(200)
            .json({
                message: "Login successful",
                ok: true,
                status: 200,
                accessToken
            });



    } catch (error) {
        return next(error);
    }

});


router.post("/register", async (req: Request<{}, {}, ILoginForm>, res: Response<ISignInError | IAccessTokenResponse>, next: NextFunction) => {
    const { username, password } = req.body;

    const usernameResult = usernamePasswordSchema.safeParse(username);
    if (!usernameResult.success) {
        return res.status(400).json({
            message: usernameResult.error.issues[0].message,
            inputType: "username"
        });

    }

    const passwordResult = usernamePasswordSchema.safeParse(password);
    if (!passwordResult.success) {
        return res.status(400).json({
            message: passwordResult.error.issues[0].message,
            inputType: "password"
        });
    }


    try {
        // const hashedPassword: string = await bcrypt.hash(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);

        // const newUser = await prisma.user.create({
        //     data: {
        //         username,
        //         password: hashedPassword
        //     }
        // });

        // req.logIn(newUser, (err) => {
        //     if (err) {
        //         return next(err);
        //     }

        //     return res.status(201).json({ message: "User registered successfully", user: newUser });
        // });


        

    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(400).json({
                    message: "Username already exists",
                    inputType: "username"
                });

            }

        }

        return next(error);

    }
});



router.delete("/logout", ensureAuthentication, (req: Request, res: Response, next: NextFunction) => {


});















router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res.status(500).json({ message: "Internal server error", error: err });

});