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
    const { auth } = useCheckAuth();


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
    const { auth } = useCheckAuth();



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
