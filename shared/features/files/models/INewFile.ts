import z from "zod";
import { allowedTypes, maxFileSizeInBytes } from "../constants";


export const NewFileRequestSchema = z.custom<FileList | undefined>()
  .superRefine((files, ctx) => {
    if (!files || !(files instanceof FileList)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File is required",
      });
      return;
    }

    if (files.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one file must be uploaded.",
      });
      return;
    }

    const file = files.item(0)!;

    if (file.size > maxFileSizeInBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
          } MB`,
      });
    }

    if (!allowedTypes.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File type is not allowed.",
      });
    }
  });




// export const NewFileRequestSchema = z.preprocess(
//   (value) => {
//     if (value instanceof FileList && value.length > 0) {
//       return value.item(0);
//     }
//     return null;
//   },
//   z
//     .instanceof(File)
//     .refine((file) => file.size <= maxFileSizeInBytes, {
//       message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
//         } MB`,
//     })
//     .refine((file) => allowedTypes.includes(file.type), {
//       message: "File type is not allowed.",
//     })
// );







// export const NewFileRequestSchema = z
//   .custom<FileList>()
//   .refine(
//     (files): files is FileList =>
//       files instanceof FileList && files.length === 1,
//     { message: "Exactly one file must be uploaded." }
//   )
//   .refine(
//     (files) => {
//       const file = files.item(0);
//       return !!file && file.size <= maxFileSizeInBytes;
//     },
//     {
//       message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
//         } MB`,
//     }
//   )
//   .refine(
//     (files) => {
//       const file = files.item(0);
//       return !!file && allowedTypes.includes(file.type);
//     },
//     {
//       message: "File type is not allowed.",
//     }
//   );



// export const NewFileRequestSchema = z.instanceof(FileList)
//   .refine((fileList) => fileList.length === 1, {
//     message: "Exactly one file must be uploaded.",
//   })
//   .refine((fileList) => fileList[0].size <= maxFileSizeInBytes, {
//     message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024} MB`,
//   })
//   .refine((fileList) => allowedTypes.includes(fileList[0].type), {
//     message: "File type is not allowed.",
//   })


// export const NewFileRequestSchema = z
//   .instanceof(FileList)
//   .refine((files) => files.length === 1, {
//     message: "Exactly one file must be uploaded",
//   })
//   .refine(
//     (files) => {
//       const file = files.item(0);
//       return !!file;
//     },
//     { message: "Invalid file" }
//   )
//   .refine(
//     (files) => {
//       const file = files.item(0);
//       return file ? file.size <= maxFileSizeInBytes : false;
//     },
//     {
//       message: `File size must be less than ${
//         maxFileSizeInBytes / 1024 / 1024
//       } MB`,
//     }
//   )
//   .refine(
//     (files) => {
//       const file = files.item(0);
//       return file ? allowedTypes.includes(file.type) : false;
//     },
//     {
//       message: "File type is not allowed",
//     }
//   );


export type INewFileRequest = z.infer<typeof NewFileRequestSchema>;




// export const NewFileRequestBackendSchema = NewFileRequestSchema.extend({
//     parentFolderId: z.string(),
// });


// export type INewFileRequestBackend = z.infer<typeof NewFileRequestBackendSchema>;





