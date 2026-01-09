import { Outlet } from "react-router-dom";
import { HeaderNavBar } from "../components/HeaderNavBar";
import styles from "./ContentPagesLayout.module.css";


export function ContentPagesLayout() {

    return (
        <>
            <div className={styles.outerContainer}>
                <HeaderNavBar />

                <Outlet />
            </div>
        
        
        
        </>
    )
}