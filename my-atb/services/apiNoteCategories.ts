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
    }),
});

export const {useListQuery: useNoteCategoriesListQuery} = apiNoteCategories;


