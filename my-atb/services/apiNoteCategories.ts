import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "@/utils/createBaseQuery";

export interface INoteCategoryItem {
    id: number;
    name: string;
    image: string;
    dateCreated: string;
}

export const apiNoteCategories = createApi({
    reducerPath: "apiNoteCategories",
    baseQuery: createBaseQuery("NoteCategories"),
    tagTypes: ["NoteCategories"],
    endpoints: (builder) => ({
        list: builder.query<INoteCategoryItem[], void>({
            query: () => ({
                url: "List",
                method: "GET"
            }),
            providesTags: ["NoteCategories"]
        }),
        create: builder.mutation<INoteCategoryItem, { name: string; image: any }>({ // image: File | Blob | undefined
            query: ({name, image}) => {
                const formData = new FormData();
                formData.append("Name", name);
                if (image) {
                    formData.append("Image", image);
                }
                return {
                    url: "Create",
                    method: "POST",
                    body: formData
                };
            },
            invalidatesTags: ["NoteCategories"]
        }),
    }),
});

export const {
    useListQuery: useNoteCategoriesListQuery,
    useCreateMutation: useCreateNoteCategoryMutation
} = apiNoteCategories;


