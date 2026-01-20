import { createContext, useEffect, useState } from "react";
import { IAuthContext } from "../models/IUserAuthLevel";
import React from "react";
import { formResponseHandler } from "../services/FormResponseHandler";
import { domain } from "../services/EnvironmentAPI";
import { useNavigate } from "react-router-dom";
import { set } from "zod";
import { APISuccessSchema } from "../../../shared/features/api/models/APISuccessResponse";
import { adminAuth, guestAuth, userAuth } from "../constants/authContexts";
import { useAuthHandler } from "../hooks/useAuthHandler";
import { resolveAuthResponse } from "../services/AuthHandler";


type ISetAuthContext = {
    userAuth: IAuthContext;
    setUserAuth: React.Dispatch<React.SetStateAction<IAuthContext>>;
};

export const AuthContext = createContext<ISetAuthContext | null>(null);



export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}



export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IAuthContext>({
        isLoading: true,
        authLevel: {
            level: "GUEST",
            mainMenuNav: "/sign-in/register",
            mainMenuText: "Register account",
            postPermission: false,
            logoutPermission: false,
            deleteBlogPermission: false,
            commentPermission: false,
        }
    });


    // const { handleAuthResponse } = useAuthHandler(setUser);


    useEffect(() => {
        const fetchAuthLevel = async () => {

            // try {

            //SO WE MUST DO ACCESS TOKEN AND IF THAT DOESN'T WORK THEN REFRESH TOKEN TO ACCESS TOKEN AGAIN
            //SO TECHNICALLY WE CAN USE THE ORIGINAL FORMHANDLER FUNCTION WE JUST HAVE TO CHANGE THAT FUNCTIONALITY

            const response = await fetch(
                `${domain}/api/auth/checkAuthLevel`,
                {
                    method: "GET"
                }
            )

            if (response.status === 401) {
                setUser(guestAuth());
                return;
            }

            if (response.status === 403) {
                setUser(userAuth());
                return;
            }

            if (response.status === 200) {
                const data = await response.json();
                const adminResult = APISuccessSchema.safeParse(data);

                if (adminResult.success) {
                    setUser(adminAuth());
                    return;
                }
            }

            setUser(guestAuth());

            // handleAuthResponse(response);

            // if (!response) return;

            // if ((response.type === "userAuthError" && response.status === 401) || response.type === "customError") {
            //     setUser(guestAuth());
            //     return;
            // }

            // if (response.type === "userAuthError" && response.status === 403) {
            //     setUser(userAuth());
            //     return;
            // }


            // if (response.type !== "response") {
            //     setUser(guestAuth());
            //     return;
            // }

            // const data = await response.data.json();
            // const adminResult = APISuccessSchema.safeParse(data);

            // if (adminResult.success) {
            //     setUser(adminAuth());
            //     return;
            // }

            // console.log("NOT EXPECTED FORMAT RETURNED FROM AUTH LEVEL CHECK");

            // setUser(guestAuth());



            // } catch (error) {
            //     console.error("Error fetching auth level:", error);
            //     setUser(guestAuth());
            //     return;
            // }


        };

        fetchAuthLevel();


    }, []);





    const ctx: ISetAuthContext = {
        userAuth: user,
        setUserAuth: setUser,
    }




    return (
        <AuthContext.Provider value={ctx}>
            {children}
        </AuthContext.Provider>
    );
}