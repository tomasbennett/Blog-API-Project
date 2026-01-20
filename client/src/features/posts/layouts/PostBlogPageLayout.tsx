import { useForm } from "react-hook-form";
import styles from "./PostBlogPageLayout.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { INewBlogReq, NewBlogReqSchema } from "../../../../../shared/features/blogs/models/INewBlogClientRequest";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { useAuth } from "../../../context/useAuthLevel";
import { guestAuth, userAuth as userAuthFunc } from "../../../constants/authContexts";


export function PostBlogPageLayout() {

    const { userAuth, setUserAuth } = useAuth();


    if (userAuth.authLevel.postPermission === false) {
        return <Navigate to="/" replace />;
    }





    const [isLoading, setIsLoading] = useState<boolean>(false);


    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset
    } = useForm<INewBlogReq>({
        resolver: zodResolver(NewBlogReqSchema),
        mode: "onSubmit",
        reValidateMode: "onChange"
    });


    const navigate = useNavigate();

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {

        return () => {
            abortControllerRef.current?.abort();
        }
    }, []);



    const onSubmit = async (data: INewBlogReq) => {

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();



        console.log("ONSUBMIT RUNNING!!!");

        const file = data.blogImgFile?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title);
        formData.append("body", data.body);

        try {
            clearErrors()
            setIsLoading(true);

            console.log("RESPONSE RUNNING!!!");

            const response = await formResponseHandler(
                `${domain}/api/files/upload`,
                {
                    method: "POST",
                    body: formData
                },
                navigate
            );

            console.dir(response);

            if (!response) {
                console.log("NO RESPONSE GIVEN!!!");
                return;
            }


            if (response.type === "userAuthError" && response.status === 401) {
                setUserAuth(guestAuth());
                navigate("/");
                return;
            }

            if (response.type === "userAuthError" && response.status === 403) {
                setUserAuth(userAuthFunc());
                navigate("/");
                return;
            }



            if (response.type === "customError" || response.type === "userAuthError") {
                setError("root", {
                    message: response.error.message,
                    type: "server"
                });
                return;
            }





            const serverResponse = response.data;
            if (serverResponse.ok) {
                reset();
                navigate("/");
                console.log("IT WORKED BUT SOMETHING MIGHT BE WRONG BACKEND???");
                return;
            }





            const serverJson = await serverResponse.json();

            const errorResult = APIErrorSchema.safeParse(serverJson);
            if (errorResult.success) {
                setError("root", {
                    message: errorResult.data.message,
                    type: "server"
                });
                return;
            }


            setError("root", {
                message: notExpectedFormatError.message,
                type: "server"
            });
            return;






        } catch (error) {

            setError("root", {
                message: jsonParsingError.message,
                type: "server"
            });
            return;


        } finally {
            setIsLoading(false);

        }
    }





    return (
        <>

            <div className={styles.outerContainer}>

                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <h2 className={styles.header}>
                        Create a Blog
                    </h2>
                    {
                        errors.root?.message &&
                        <p className={styles.error}>
                            {errors.root?.message}
                        </p>
                    }


                    <div className={styles.inputLabelContainer}>
                        {
                            errors.blogImgFile?.message &&
                            <p className={styles.error}>
                                {errors.blogImgFile.message}
                            </p>
                        }
                        <label htmlFor="image">Blog cover image</label>
                        <input
                            {...register("blogImgFile")}
                            type="file"
                            id="image"
                            
                        />
                    </div>



                    <div className={styles.inputLabelContainer}>
                        {
                            errors.title?.message &&
                            <p className={styles.error}>
                                {errors.title.message}
                            </p>
                        }
                        <label htmlFor="title">Blog title</label>
                        <input
                            {...register("title")}
                            type="text"
                            id="title"
                            placeholder="Please enter a blog title here..."
                        />
                    </div>





                    <div className={styles.inputLabelContainer}>
                        {
                            errors.body?.message &&
                            <p className={styles.error}>
                                {errors.body.message}
                            </p>
                        }
                        <label htmlFor="body">Blog body</label>
                        <textarea
                            {...register("body")}
                            id="body"
                            placeholder="Please enter a blog body message here..."
                        ></textarea>
                    </div>

                    <button className={styles.submitBtn} type="submit">
                        {
                            isLoading ?
                                <LoadingCircle height="80%" />

                                :

                                "Submit"
                        }
                    </button>

                </form>

            </div>

        </>
    )
}