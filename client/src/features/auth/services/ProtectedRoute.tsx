import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { domain } from "../../../services/EnvironmentAPI";
import { accessTokenLocalStorageKey } from "../constants";
import { AccessTokenResponseSchema } from "../../../../../shared/features/auth/models/IAccessTokenResponse";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { notExpectedFormatError } from "../../../constants/constants";
import { ISignInError } from "../../../../../shared/features/auth/models/ILoginSchema";
import { NewAccessTokenRequest } from "./NewAccessTokenRequest";
import { SendToSignInErrorHandler } from "../../../services/SendToSignInErrorHandler";
import { useCheckAuth } from "../hooks/useCheckAuth";




export function ProtectedRoute() {
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

                
                const authRequest = await fetch(`${domain}/random`, {
                    method: "GET",

                });
                console.log("DOES THE REQ EVEN SEND");




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

    useEffect(() => {
        console.log("Protected route is running: " + auth);
    }, []);


    if (auth === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: '1 1 0' }}>
                <LoadingCircle height="5rem" />
            </div>
        )

    } else if (auth === false) {
        return <Navigate to="/sign-in/login" replace />;

    } else {
        return <Outlet />;

    }

}



export function NotAuthenticatedRoute() {
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

                
                const authRequest = await fetch(`${domain}/random`, {
                    method: "GET",

                });
                console.log("DOES THE REQ EVEN SEND");




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

    useEffect(() => {
        console.log("Notprotected route is running: " + auth);
    }, []);


    if (auth === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: '1 1 0' }}>
                <LoadingCircle height="5rem" />
            </div>
        )
    }

    if (auth === false) {
        return <Outlet />;
    }

    return <Navigate to="/" replace />;
}
