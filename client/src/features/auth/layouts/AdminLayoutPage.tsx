import { useForm } from "react-hook-form";
import styles from "./AdminLayoutPage.module.css";
import { AdminReqSchema, IAdminReq } from "../../../../../shared/features/admin/models/IAdminReq";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { domain } from "../../../services/EnvironmentAPI";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuthLevel";
import { adminAuth, guestAuth } from "../../../constants/authContexts";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants";

export function AdminLayoutPage() {
    const {
        userAuth,
        setUserAuth
    } = useAuth();


    if (userAuth.authLevel.level !== "USER") {
        return <Navigate to="/" replace />;
    }











    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset

    } = useForm<IAdminReq>({
        resolver: zodResolver(AdminReqSchema),

    });

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const navigate = useNavigate();

    const onSubmit = async (data: IAdminReq) => {
        console.log(data);


        try {
            setIsLoading(true);
            clearErrors();

            const response = await formResponseHandler(
                `${domain}/api/admin/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                },
                navigate
            );

            if (!response) {
                return;
            }

            if (response.type === "customError") {
                setError("root", {
                    type: "server",
                    message: response.error.message
                });
                return;
            }

            if (response.type === "userAuthError") {
                setUserAuth(guestAuth());
                navigate("/", { replace: true });
                return;
            }

            if (response.data.status === 201 || response.data.status === 200) {
                setUserAuth(adminAuth());
                navigate("/", { replace: true });
                return;
            }

            const json = await response.data.json();

            const customErrorResult = APIErrorSchema.safeParse(json);
            if (customErrorResult.success) {
                setError("root", {
                    type: "server",
                    message: customErrorResult.data.message
                });
                return;
            }


            setError("root", {
                type: "server",
                message: notExpectedFormatError.message
            });

            return;




        } catch (error) {
            setError("root", {
                type: "server",
                message: jsonParsingError.message
            });


        } finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            <div className={styles.outerContainer}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <h2 className={styles.header}>
                        Admin Dashboard
                    </h2>

                    {
                        errors.root &&
                            <div className={styles.error}>
                                {errors.root.message}
                            </div>
                    }

                    <div className={styles.inputLabelContainer}>
                        <label htmlFor="admin-secret">Enter the Admin secret</label>
                            {
                                errors.adminSecret &&
                                    <div className={styles.error}>
                                        {errors.adminSecret.message}
                                    </div>
                            }
                        
                        <input {...register("adminSecret")} type="text" id="admin-secret" placeholder="Please enter secret here..." />
                    </div>


                    <button className={styles.submitBtn} type="submit">
                        {
                            isLoading ?
                                <LoadingCircle height="100%" />
                                :
                                "Submit"
                        }
                    </button>

                </form>
            </div>
        </>
    )
}