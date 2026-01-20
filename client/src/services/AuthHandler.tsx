import { APISuccessSchema } from "../../../shared/features/api/models/APISuccessResponse";
import { guestAuth, userAuth as userAuthFunc, adminAuth } from "../constants/authContexts";
import { useAuth } from "../context/useAuthLevel"
import { IResponseTypes } from "../models/IResponseTypes";
import { IAuthContext } from "../models/IUserAuthLevel";

export const resolveAuthResponse = async (response: IResponseTypes<Response> | null): Promise<IAuthContext> => {
    try {

        if (!response) return guestAuth();

        if ((response.type === "userAuthError" && response.status === 401) || response.type === "customError") {
            return guestAuth();
        }

        if (response.type === "userAuthError" && response.status === 403) {
            // setUser(userAuthFunc());
            return userAuthFunc();
        }


        if (response.type !== "response") {
            // setUser(guestAuth());
            return guestAuth();
        }

        const data = await response.data.json();
        const adminResult = APISuccessSchema.safeParse(data);

        //SO TO BE AN ADMIN MEANS MORE THAN THIS
        //UPON EACH REQUEST INDIVIDUALLY CHECK IF THE USER HAS THE RIGHTS AND ONLY CHANGE IT IF IT'S A 401 OR A 403
        //ON LOGIN CHANGE IT TO USER //TICK
        //ON LOGOUT CHANGE IT TO GUEST //TICK
        //ON ADMIN CHANGE IT TO ADMIN
        //NOW FOR ALL AUTH USER BACKEND ROUTES CHECK FOR 401 ERRORS TO SEND US TO GUEST
        //AND FOR ALL ADMIN ROUTES CHECK FOR 403 ERRORS TO SEND US TO USER OR 401 TO GUEST

        if (adminResult.success) {
            // setUser(adminAuth());
            return adminAuth();
        }

        console.log("NOT EXPECTED FORMAT RETURNED FROM AUTH LEVEL CHECK");

        return guestAuth();



    } catch (error) {
        console.error("Error fetching auth level:", error);
        // setUser(guestAuth());
        return guestAuth();
    }
}
