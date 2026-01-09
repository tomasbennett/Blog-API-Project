import { NavigateFunction } from "react-router-dom";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { AccessTokenResponseSchema } from "../../../../../shared/features/auth/models/IAccessTokenResponse";
import { ISignInError } from "../../../../../shared/features/auth/models/ILoginSchema";
import { accessTokenLocalStorageKey, notExpectedFormatError } from "../../../constants/constants";
import { domain } from "../../../services/EnvironmentAPI";
import { SendToSignInErrorHandler } from "../../../services/SendToSignInErrorHandler";
import { invalidRefreshTokenStatus } from "../../../../../shared/features/auth/constants";

export async function NewAccessTokenRequest(
    navigate: NavigateFunction
): Promise<string | undefined> {
    try {

        console.log("THE NEW ACCESS TOKEN REQ RUNS");
        const newAccessTokenReq = await fetch(`${domain}/api/auth/refreshToken`, {
            credentials: "include"
        });
    
        if (newAccessTokenReq.status === invalidRefreshTokenStatus) {
            navigate("/sign-in/login");
            return;
        }

    
        const accessTokenJSON = await newAccessTokenReq.json();
    
        const accessTokenResult = AccessTokenResponseSchema.safeParse(accessTokenJSON);
        if (accessTokenResult.success) {
            localStorage.setItem(accessTokenLocalStorageKey, accessTokenResult.data.accessToken);
            return accessTokenResult.data.accessToken
        }
    
        const apiCustomErrorResult = APIErrorSchema.safeParse(accessTokenJSON);
        if (apiCustomErrorResult.success) {
            const signInError: ISignInError = {
                inputType: "root",
                message: apiCustomErrorResult.data.message
            }
    
            navigate("/sign-in/login", {
                state: {
                    error: signInError
                }
            });
            return;
        }
    
        const signInError: ISignInError = {
            inputType: "root",
            message: notExpectedFormatError.message
        }
        navigate("/sign-in/login", {
            state: {
                error: signInError
            }
        });
    
        return;

    } catch (error) {

        console.log("ERROR OCCURS WHEN FETCHING without ACCESS TOKEN: ", error);
        SendToSignInErrorHandler(error, navigate);


    }
}