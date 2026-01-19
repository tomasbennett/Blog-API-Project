export type IUserAuthLevel = "NOT_SIGNED_IN" | "USER" | "ADMIN";


export type IAuthContext = {
    isLoading: boolean;
    authLevel: IUserAuthLevel;
}