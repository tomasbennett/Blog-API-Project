import { NavigateFunction } from "react-router-dom";

import { FieldValues, UseFormSetError } from "react-hook-form";
import { ICustomErrorResponse, APIErrorSchema } from "../../../shared/features/api/models/APIErrorResponse";
import { ISignInError } from "../../../shared/features/auth/models/ILoginSchema";
import { accessTokenLocalStorageKey, jsonParsingError } from "../constants/constants";
import { NewAccessTokenRequest } from "./NewAccessTokenRequest";
import { GetAccessToken } from "./GetAccessToken";
import { IResponseTypes } from "../models/IResponseTypes";


//In this one if its a customError then we can set the setIsError state BUT if it's userAuthError we need to return it to the component
export async function basicResponseHandle(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction,
    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>,
): Promise<IResponseTypes<Response> | null> {
    const accessToken = await GetAccessToken(navigate);
    if (!accessToken) return null;

    if (accessToken.type !== "response") {
        return accessToken;
    }

    const res = await FetchHandlerHelper(
        url,
        fetchOptions,
        navigate,
        accessToken.data,
        setIsError
    );


    return res;

}



async function FetchHandlerHelper(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction,
    accessToken: string,
    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>,
    hasRetried: boolean = false
): Promise<IResponseTypes<Response> | null> {
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
                setIsError(jsonParsingError);
                return null;

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

                if (newAccessToken.type !== "response") {
                    return newAccessToken;
                }

                const res = await FetchHandlerHelper(
                    url,
                    fetchOptions,
                    navigate,
                    newAccessToken.data,
                    setIsError,
                    true
                );

                return res;

            }



            return {
                type: "userAuthError",
                status: 401,
                error: {
                    ok: false,
                    status: 401,
                    message: "Your session has expired. Please sign in again!!!"
                }
            };

        }

        if (response.status === 403) {
            return {
                type: "userAuthError",
                status: 403,
                error: {
                    ok: false,
                    status: 403,
                    message: "You do not have permission to perform this action!!!"
                }
            };
        }

        return {
            type: "response",
            // status: 200,
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
        setIsError(customError);
        return null;

    }
}