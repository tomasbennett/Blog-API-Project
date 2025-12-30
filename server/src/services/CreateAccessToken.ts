import { User } from "@prisma/client";

import jwt from "jsonwebtoken";

export function CreateAccessToken(user: User): string {
    const accessToken = jwt.sign({
        sub: user.id,
        role: user.role
    }, process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret", {
        expiresIn: '5m'
    });

    return accessToken;
}