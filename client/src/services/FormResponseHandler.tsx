import { NavigateFunction } from "react-router-dom";

import { FieldValues, UseFormSetError } from "react-hook-form";
import { ICustomErrorResponse, APIErrorSchema } from "../../../shared/features/api/models/APIErrorResponse";
import { ISignInError } from "../../../shared/features/auth/models/ILoginSchema";
import { accessTokenLocalStorageKey, jsonParsingError } from "../constants/constants";
import { NewAccessTokenRequest } from "./NewAccessTokenRequest";
import { GetAccessToken } from "./GetAccessToken";
import { IResponseTypes } from "../models/IResponseTypes";

export async function formResponseHandler(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction
): Promise<IResponseTypes | null> {
    const accessToken = await GetAccessToken(navigate);
    if (!accessToken) return null;

    const res = await FetchHandlerHelper(
        url,
        fetchOptions,
        navigate,
        accessToken
    );


    return res;

}



async function FetchHandlerHelper(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction,
    accessToken: string,
    hasRetried: boolean = false
): Promise<IResponseTypes | null> {
    try {


        const authFetchOptions: RequestInit = {
            ...fetchOptions,
            headers: {
                ...fetchOptions?.headers,
                Authorization: `Bearer ${accessToken}`
            }
        }


        const response = await fetch(url, authFetchOptions);

        if (response.status >= 500 && response.status <= 599) {

            const serverError: ICustomErrorResponse = {
                ok: false,
                status: response.status,
                message: response?.statusText || "Internal Server Error"
            };

            try {
                const data = await response.json();

                const result = APIErrorSchema.safeParse(data);
                if (result.success) {
                    serverError.message = result.data.message;

                }

            } catch (err) {
                console.error("Error parsing server error response:", err);
                return { type: "customError", error: jsonParsingError };

            }

            navigate('/error', {
                replace: true,
                state: {
                    error: serverError
                }
            });

            return null;
        }

        if (response.status === 401) {
            console.log("DATA SENT CORRECTLY FROM ERROR HANDLER!!!");

            if (!hasRetried) {

                const newAccessToken = await NewAccessTokenRequest(navigate);
                if (!newAccessToken) return null;

                const res = await FetchHandlerHelper(
                    url,
                    fetchOptions,
                    navigate,
                    newAccessToken,
                    true
                );

                return res;

            }





            const signInError: ISignInError = {
                message: "You were logged out!!!",
                inputType: "root"
            }
            navigate('/sign-in/login', {
                replace: true,
                state: {
                    error: signInError
                }
            });

            return null;

        }

        return {
            type: "response",
            data: response
        };







    } catch (error: unknown) {
        console.error("Error fetching folder page data:", error);

        if (!(error instanceof Error)) {
            navigate('/error', {
                replace: true,
                state: {
                    error: {
                        ok: false,
                        status: 0,
                        message: "An unknown error occurred."
                    }
                }
            });

            return null;
        }

        if (error.name === "AbortError") {
            console.log("Fetch aborted in catch block!!!");
            return null; // ??? Why return null here or error?

        }

        const customError: ICustomErrorResponse = {
            ok: false,
            status: 0,
            message: error.message
        };
        return {
            type: "customError",
            error: customError
        };

    }
}