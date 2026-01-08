import { LogoutIcon } from "../assets/icons/LogoutIcon";
import { PostsIcon } from "../assets/icons/PostsIcon";
import styles from "./HeaderNavBar.module.css";

import { NavLink, Outlet } from "react-router-dom";

export function HeaderNavBar() {


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

                                <NavLink to={"/home"}>
                                    Home
                                </NavLink>

                            </li>

                            <li>

                                <NavLink to={"/about"}>
                                    About
                                </NavLink>

                            </li>

                            <li>

                                <NavLink to={"/contacts"}>
                                    Contacts
                                </NavLink>

                            </li>

                        </ul>
                    </nav>

                    <div className={styles.signInOrOutContainer}>

                        <LogoutIcon />

                    </div>


                </div>



            </header>

            <Outlet />        
        </>
    )
}