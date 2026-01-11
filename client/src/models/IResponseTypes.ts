import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export type IResponseTypes = { type: "response", data: Response } |
                             { type: "customError", error: ICustomErrorResponse }