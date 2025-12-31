import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SendToSignInErrorHandler } from "../../../services/SendToSignInErrorHandler";
import { accessTokenLocalStorageKey } from "../constants";
import { NewAccessTokenRequest } from "../services/NewAccessTokenRequest";
import { domain } from "../../../services/EnvironmentAPI";

export function useCheckAuth() {
    const [auth, setAuth] = useState<boolean | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            try {
                //CHECK IF THE ACCESS TOKEN YOU HAVE WORKS IF NOT REFRESH AND THEN SET AUTH
                const accessToken = localStorage.getItem(accessTokenLocalStorageKey);
                if (!accessToken) {
                    //IMMEDIATELY ASK THE REFRESH TOKEN FOR A NEW ONE
                    
                    const newAccessToken = await NewAccessTokenRequest(navigate);

                    if (!newAccessToken) {
                        setAuth(false);
                        return;
                    }

                    setAuth(true);
                    return;


                }

                //NOW USE THE ACCESS TOKEN TO ACCESS THE CHECK/AUTH
                const authRequest = await fetch(`${domain}/auth/checkAccessToken`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (authRequest.ok) {
                    setAuth(true);
                    return;
                }

                const newAccessToken = await NewAccessTokenRequest(navigate);

                if (!newAccessToken) {
                    setAuth(false);
                    return;
                };

                setAuth(true);
                return;


            } catch (error) {

                setAuth(false);
                SendToSignInErrorHandler(error, navigate);


            }
        }

        checkAuth();
    }, []);


    return {
        auth
    }
}