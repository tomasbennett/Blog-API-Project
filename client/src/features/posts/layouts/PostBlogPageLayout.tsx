import { useForm } from "react-hook-form";
import styles from "./PostBlogPageLayout.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { INewBlogReq, NewBlogReqSchema } from "../../../../../shared/features/blogs/models/INewBlogRequest";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { basicResponseHandle } from "../../../services/BasicResponseHandle";
import { domain } from "../../../services/EnvironmentAPI";
import { formResponseHandler } from "../../../services/FormResponseHandler";
import { notExpectedFormatError } from "../../../constants/constants";


export function PostBlogPageLayout() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<ICustomErrorResponse | null>(null);


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


    const onSubmit = async (data: INewBlogReq) => {

        const file = data.blogImgFile?.[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append("blogImgFile", file);
        formData.append("title", data.title);
        formData.append("body", data.body);

        try {
            clearErrors()
            setIsLoading(true);
            setIsError(null);

            const response = await formResponseHandler(
                `${domain}/api/files/upload`,
                {
                    method: "POST",
                    body: formData
                },
                navigate
            );

            if (!response) {
                return;
            }

            if (response.type === "customError") {
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




        } finally {
            setIsLoading(false);

        }
    }




    return (
        <>

            <div className={styles.outerContainer}>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <label htmlFor="image">Blog cover image</label>
                        <input {...register("blogImgFile")} type="file" name="image" id="image" />
                    </div>


                    <div>
                        <label htmlFor="title">Blog title</label>
                        <input {...register("title")} type="text" name="title" id="title" />
                    </div>

                    <div>
                        <label htmlFor="body">Blog body</label>
                        <textarea {...register("body")} name="body" id="body"></textarea>
                    </div>

                </form>

            </div>

        </>
    )
}