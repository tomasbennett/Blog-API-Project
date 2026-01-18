import { useForm } from "react-hook-form"
import styles from "./AddCommentForm.module.css"
import { CommentRequestSchemaClient, ICommentRequestClient, ICommentRequestServer } from "../../../../../shared/features/comments/models/ICommentRequest"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse"
import { formResponseHandler } from "../../../services/FormResponseHandler"
import { domain } from "../../../services/EnvironmentAPI"
import { useNavigate } from "react-router-dom"
import { CommentResponseSchema, IComment } from "../../../../../shared/features/comments/models/ICommentResponse"
import { jsonParsingError, notExpectedFormatError } from "../../../constants/constants"
import { LoadingCircle } from "../../../components/LoadingCircle"

type IAddCommentFormProps = {
    blogId: string,
    setComments: React.Dispatch<React.SetStateAction<IComment[]>>
}


export function AddCommentForm({
    blogId,
    setComments
}: IAddCommentFormProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const {
        register,
        setError,
        reset,
        clearErrors,
        handleSubmit,
        formState: { errors }
    } = useForm<ICommentRequestClient>({
        resolver: zodResolver(CommentRequestSchemaClient),

    });

    const navigate = useNavigate()

    const onSubmit = async (data: ICommentRequestClient) => {





        try {
            setIsLoading(true);
            clearErrors();

            const submitData: ICommentRequestServer = {
                ...data,
                blogId
            }


            const response = await formResponseHandler(
                `${domain}/api/comment`,
                {
                    method: "POST",
                    body: JSON.stringify(submitData),
                    headers: {
                        "Content-Type": "application/json"
                    },
                },
                navigate
            );

            console.dir(response);

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

            const resJson = await response.data.json();

            const commentResult = CommentResponseSchema.safeParse(resJson);
            if (commentResult.success) {
                setComments(prev => [...prev, commentResult.data.comment]);
                reset();
                return;
            }

            const errorResult = APIErrorSchema.safeParse(resJson);
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

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <h2 className={styles.formHeader}>
                        Leave a comment
                    </h2>

                    {
                        errors.root?.message &&
                        <p className={styles.error}>
                            {errors.root.message}
                        </p>
                    }


                    <div className={styles.labelInputContainer}>
                        <label htmlFor="add-comment">Add Comment</label>
                        {
                            errors.body?.message &&
                            <p className={styles.error}>
                                {errors.body.message}
                            </p>
                        }
                        <input {...register("body")} placeholder="Add Comment here..." type="text" id="add-comment" />
                    </div>

                    <button className={styles.submitBtn} type="submit">
                        {
                            isLoading ?
                                <LoadingCircle height="100%" />

                            :

                                "Post Comment"
                        }
                    </button>

                </form>


            </div>


        </>
    )
}