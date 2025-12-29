import styles from "./BackgroundVideoContainer.module.css";
import video from "../assets/videos/login-therapeutic-screen.mp4";
import { useRef } from "react";


type IBackgroundVideoContainerProps = {
    children?: React.ReactNode
}

export function BackgroundVideoContainer({
    children
}: IBackgroundVideoContainerProps) {
    // const videoRef = useRef<HTMLVideoElement | null>(null);
    // const setPlayBack = () => {
    //     videoRef.current!.playbackRate = 0.9;
    // }; onCanPlay={setPlayBack} ref={videoRef}

    return (
        <>
            <div className={styles.backgroundVideoContainer}>
                <video playsInline autoPlay muted loop className={styles.backgroundVideo}>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className={styles.overlay}></div>
                <div className={styles.content}>
                    {
                        children
                    }
                </div>
            </div>
        </>
    )
}