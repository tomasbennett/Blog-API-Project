import { IAuthContext } from "../models/IUserAuthLevel"

export const guestAuth = (): IAuthContext => ({
    isLoading: false,
    authLevel: {
        level: "GUEST",
        mainMenuNav: "/sign-in/register",
        mainMenuText: "Register account",
        postPermission: false,
        logoutPermission: false,
        deleteBlogPermission: false,
        commentPermission: false
    }
})

export const userAuth = (): IAuthContext => ({
    isLoading: false,
    authLevel: {
        level: "USER",
        mainMenuNav: "/admin",
        mainMenuText: "Become an Admin",
        postPermission: false,
        logoutPermission: true,
        deleteBlogPermission: false,
        commentPermission: true
    }
})

export const adminAuth = (): IAuthContext => ({
    isLoading: false,
    authLevel: {
        level: "ADMIN",
        mainMenuNav: "/post",
        mainMenuText: "Create Post",
        postPermission: true,
        logoutPermission: true,
        deleteBlogPermission: true,
        commentPermission: true
    }
})
