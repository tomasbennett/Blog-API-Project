import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SendToSignInErrorHandler } from "../../../services/SendToSignInErrorHandler";
import { NewAccessTokenRequest } from "../../../services/NewAccessTokenRequest";
import { domain } from "../../../services/EnvironmentAPI";
import { accessTokenLocalStorageKey } from "../../../constants/constants";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { useAuth } from "../../../context/useAuthLevel";
import { adminAuth, guestAuth, userAuth as userAuthFunc } from "../../../constants/authContexts";

export function useCheckAuth() {
    // const [auth, setAuth] = useState<boolean | null>(null);
    const {
        userAuth,
        setUserAuth
    } = useAuth();


    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            // try {
            const response = await formResponseHandler(
                `${domain}/api/auth/checkAuthLevel`,
                {
                    method: "GET"
                },
                navigate
            );

            if (!response) {
                return;
            }

            if (response.type === "response" && response.data.status === 200) {
                setUserAuth(adminAuth());
                return;
            }

            if ((response.type === "userAuthError" && response.status === 401) || response.type === "customError") {
                setUserAuth(guestAuth());
                return;

            }

            if (response.type === "userAuthError" && response.status === 403) {
                setUserAuth(userAuthFunc());
                return;
            }


            //I THINK THAT I CLEARED ALL OUTCOMES ABOVE BUT JUST IN CASE

            setUserAuth(guestAuth());
            return;





            // } catch (error) {

            //     console.log("ERROR OCCURS WHEN FETCHING WITH ACCESS TOKEN: ", error);
            //     setUserAuth(guestAuth());
            //     SendToSignInErrorHandler(error, navigate);


            //     // setAuth(false);

            // }
        }

        checkAuth();
    }, []);


    return {
        userAuth
    }
}