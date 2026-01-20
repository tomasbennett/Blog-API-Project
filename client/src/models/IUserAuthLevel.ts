type IAuthLevels = "GUEST" | "USER" | "ADMIN";

type IUserAuthLayout<L extends IAuthLevels> = {
    level: L;
    mainMenuNav: string;
    mainMenuText: string;
    postPermission: boolean;
    logoutPermission: boolean;
    deleteBlogPermission: boolean;
    commentPermission: boolean;
};


type IGuestAuth = IUserAuthLayout<"GUEST"> & {
    mainMenuNav: "/sign-in/register";
    mainMenuText: "Register account";
    postPermission: false;
    logoutPermission: false;
    deleteBlogPermission: false;
    commentPermission: false;
};


type IUserAuth = IUserAuthLayout<"USER"> & {
    mainMenuNav: "/admin";
    mainMenuText: "Become an Admin";
    postPermission: false;
    logoutPermission: true;
    deleteBlogPermission: false;
    commentPermission: true;
};


type IAdminAuth = IUserAuthLayout<"ADMIN"> & {
    mainMenuNav: "/post";
    mainMenuText: "Create Post";
    postPermission: true;
    logoutPermission: true;
    deleteBlogPermission: true;
    commentPermission: true;
};


export type IUserAuthLevel = 
    IGuestAuth |
    IUserAuth |
    IAdminAuth
;




export type IAuthContext = {
    isLoading: boolean;
    authLevel: IUserAuthLevel;
}