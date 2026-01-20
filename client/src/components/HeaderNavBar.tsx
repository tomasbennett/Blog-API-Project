import { useState } from "react";
import { LogoutIcon } from "../assets/icons/LogoutIcon";
import { PostsIcon } from "../assets/icons/PostsIcon";
import { basicResponseHandle } from "../services/BasicResponseHandle";
import { domain } from "../services/EnvironmentAPI";
import styles from "./HeaderNavBar.module.css";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { accessTokenLocalStorageKey, jsonParsingError, notExpectedFormatError } from "../constants/constants";
import { useAuth } from "../context/useAuthLevel";
import { guestAuth } from "../constants/authContexts";

export function HeaderNavBar() {

    const navigate = useNavigate();

    const {
        userAuth,
        setUserAuth
    } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);


    const setActive = ({ isActive }: { isActive: boolean }) => {
        const linkClassName = styles.basicLinkClass;

        if (isActive) return `${styles.isActiveHeaderLink} ${linkClassName}`

        return `${styles.isInactiveLink} ${linkClassName}`
    }




    const onLogout = async () => {


        try {
            setIsLoading(true);
            setIsError(null);

            const response = await basicResponseHandle(
                `${domain}/api/logout`,
                {
                    method: "DELETE",
                    credentials: "include"
                },
                navigate,
                setIsError
            );


            if (!response) {
                return;
            }

            //SO HERE YOU CAN ONLY GET A 401 OR A CUSTOM ERROR

            if (response.type === "userAuthError") {
                setUserAuth(guestAuth());
                setIsError(response.error);

                return;
            }

            if (response.type === "customError") {
                setIsError(response.error);
                return;
            }




            if (response.data.status === 204) {
                localStorage.removeItem(accessTokenLocalStorageKey);
                // Maybe navigate here to login or change signin state on the main page
                setUserAuth(guestAuth());
                return;

            }

            const json = await response.data.json();
            const errorResult = APIErrorSchema.safeParse(json);

            if (errorResult.success) {
                setIsError(errorResult.data);
                return;
            }

            setIsError(notExpectedFormatError);
            return;


        } catch (error) {
            setIsError(jsonParsingError)
            console.log(error);

        } finally {
            setIsLoading(false);

        }
    }

    return (
        <>
            <header className={styles.header}>

                <div className={styles.logoImgContainer}>

                    <PostsIcon />

                    Blog


                </div>

                <div className={styles.rightSideHeaderContainer}>

                    <nav>
                        <ul className={styles.pageSelectionContainer}>

                            <li>

                                <NavLink to={"/home"} className={setActive}>
                                    Home
                                </NavLink>

                            </li>

                            <li>

                                <NavLink className={setActive} to={"/about"}>
                                    About
                                </NavLink>

                            </li>

                            <li>

                                <NavLink className={setActive} to={"/contacts"}>
                                    Contacts
                                </NavLink>

                            </li>

                            {
                                userAuth.authLevel.postPermission &&
                                    <li>

                                        <NavLink className={setActive} to={"/post"}>
                                            Post
                                        </NavLink>

                                    </li>
                            }
                            {
                                userAuth.authLevel.level === "USER" &&
                                    <li>

                                        <NavLink className={setActive} to={"/admin"}>
                                            Admin
                                        </NavLink>

                                    </li>

                            }


                        </ul>
                    </nav>

                    {
                        userAuth.authLevel.logoutPermission &&
                            <div onClick={onLogout} className={styles.signInOrOutContainer}>

                                <LogoutIcon />

                            </div>
                    }



                </div>



            </header>
        </>
    )
}