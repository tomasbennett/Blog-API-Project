import { NavigateFunction } from "react-router-dom";
import { ISignInError } from "../../../shared/features/auth/models/ILoginSchema";

export function SendToSignInErrorHandler(
    error: unknown,
    navigate: NavigateFunction
) {
    if (error instanceof Error) {
        const signInError: ISignInError = {
            inputType: "root",
            message: error.message
        }
        navigate("/sign-in/login", {
            state: {
                error: signInError
            }
        });
    }


    const signInError: ISignInError = {
        inputType: "root",
        message: "An unknown error occurred attempting to refresh your access token!!!"
    }
    navigate("/sign-in/login", {
        state: {
            error: signInError
        }
    });
}