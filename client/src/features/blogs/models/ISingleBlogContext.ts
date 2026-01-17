import { ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse"
import { IBlog } from "../../../../../shared/features/blogs/models/IBlogsArrayResponse"

export type ISingleBlogPageContext = {
    setBlog: React.Dispatch<React.SetStateAction<IBlog | null>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setIsError: React.Dispatch<React.SetStateAction<ICustomErrorResponse | null>>
}