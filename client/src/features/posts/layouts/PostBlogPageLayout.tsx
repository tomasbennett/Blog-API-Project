import { useForm } from "react-hook-form";
import styles from "./PostBlogPageLayout.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { INewBlogReq, NewBlogReqSchema } from "../../../../../shared/features/blogs/models/INewBlogRequest";
import { useNavigate } from "react-router-dom";


export function PostBlogPageLayout() {

    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm<INewBlogReq>({
        resolver: zodResolver(NewBlogReqSchema),
        mode: "onSubmit",
        reValidateMode: "onChange"
    });


    const navigate = useNavigate();


    const onSubmit = async (data: INewBlogReq) => {
        try {
            
        } catch (error) {
            
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