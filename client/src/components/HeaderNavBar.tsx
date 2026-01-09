import { useState } from "react";
import { LogoutIcon } from "../assets/icons/LogoutIcon";
import { PostsIcon } from "../assets/icons/PostsIcon";
import { basicResponseHandle } from "../services/BasicResponseHandle";
import { domain } from "../services/EnvironmentAPI";
import styles from "./HeaderNavBar.module.css";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { accessTokenLocalStorageKey } from "../constants/constants";

export function HeaderNavBar() {

    const navigate = useNavigate();
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);


    const setActive = ({ isActive }: { isActive: boolean }) => {
        const linkClassName = styles.basicLinkClass;

        if (isActive) return `${styles.isActiveHeaderLink} ${linkClassName}`

        return `${styles.isInactiveLink} ${linkClassName}`
    }




    const onLogout = async () => {


        try {
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

            if (response.ok && response.status === 204) {
                localStorage.removeItem(accessTokenLocalStorageKey);
                // Maybe navigate here to login or change signin state on the main page

                return;

            }

            const json = await response.json();
            const errorResult = APIErrorSchema.safeParse(json);

            if (errorResult.success) {
                setIsError(errorResult.data);
                return;
            }

            setIsError({
                ok: false,
                status: 0,
                message: "An unknown error occurred on the server side with the response!!!"
            });
            return;


        } catch (error) {

            console.log(error);

        }
    }

    return (
        <>
            <header className={styles.header}>

                <div className={styles.logoImgContainer}>

                    <PostsIcon />

                    Blog Project


                </div>

                <div className={styles.rightSideHeaderContainer}>

                    <nav>
                        <ul className={styles.pageSelectionContainer}>

                            <li>

                                <NavLink to={"/blogs"} className={setActive}>
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

                        </ul>
                    </nav>

                    <div onClick={onLogout} className={styles.signInOrOutContainer}>

                        <LogoutIcon />

                    </div>


                </div>



            </header>
        </>
    )
}