import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
                    console.log("ACCESS TOKEN NOT FOUND");
                    //IMMEDIATELY ASK THE REFRESH TOKEN FOR A NEW ONE
                    
                    const newAccessToken = await NewAccessTokenRequest(navigate);

                    if (!newAccessToken) {
                        setAuth(false);
                        return;
                    }

                    setAuth(true);
                    return;


                }
                
                console.log("ACCESS TOKEN FOUND: " + accessToken);

                
                const authRequest = await fetch(`${domain}/api/auth/checkAccessToken`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });




                if (authRequest.ok) {
                    console.log("ACCESS TOKEN OK: ", authRequest);
                    setAuth(true);
                    return;
                }

                console.log("ACCESS TOKEN NOT OK: ", authRequest);

                const newAccessToken = await NewAccessTokenRequest(navigate);

                if (!newAccessToken) {
                    setAuth(false);
                    return;
                };

                setAuth(true);
                return;


            } catch (error) {

                console.log("ERROR OCCURS WHEN FETCHING WITH ACCESS TOKEN: ", error);
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