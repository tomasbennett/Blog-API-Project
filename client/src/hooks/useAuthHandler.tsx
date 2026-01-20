import { APISuccessSchema } from "../../../shared/features/api/models/APISuccessResponse";
import { guestAuth, userAuth as userAuthFunc, adminAuth } from "../constants/authContexts";
import { useAuth } from "../context/useAuthLevel"
import { IResponseTypes } from "../models/IResponseTypes";
import { IAuthContext } from "../models/IUserAuthLevel";

export function useAuthHandler(
    setUser: React.Dispatch<React.SetStateAction<IAuthContext>>
) {



    const handleAuthResponse = async (response: IResponseTypes<Response> | null) => {
        try {

            if (!response) return;

            if ((response.type === "userAuthError" && response.status === 401) || response.type === "customError") {
                setUser(guestAuth());
                return;
            }

            if (response.type === "userAuthError" && response.status === 403) {
                setUser(userAuthFunc());
                return;
            }


            if (response.type !== "response") {
                setUser(guestAuth());
                return;
            }

            const data = await response.data.json();
            const adminResult = APISuccessSchema.safeParse(data);

            if (adminResult.success) {
                setUser(adminAuth());
                return;
            }

            console.log("NOT EXPECTED FORMAT RETURNED FROM AUTH LEVEL CHECK");

            setUser(guestAuth());



        } catch (error) {
            console.error("Error fetching auth level:", error);
            setUser(guestAuth());
            return;
        }
    }


    return {
        handleAuthResponse
    }

}