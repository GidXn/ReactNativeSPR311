import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "@/utils/createBaseQuery";
import {ILoginResponse} from "@/types/account/ILoginResponse";
import {IRegisterRequest} from "@/types/account/IRegisterRequest";
import {serialize} from "object-to-formdata";
import {ILoginRequest} from "@/types/account/ILoginRequest";
import {IProfileResponse} from "@/types/account/IProfileResponse";

export const apiAccount = createApi({
    reducerPath: "apiAccount",
    baseQuery: createBaseQuery("account"),
    tagTypes: ["Account"],
    endpoints: (builder) => ({
        //Зміна, видалення або оновлення, додавання
        register: builder.mutation<ILoginResponse,IRegisterRequest>({
            query: (data) => {
                const formData = serialize(data)
                return {
                    url: "register",
                    method: "POST",
                    body: formData
                }
            }
        }),
        login: builder.mutation<ILoginResponse,ILoginRequest>({
            query: (data) => {
                return {
                    url: "login",
                    method: "POST",
                    body: data
                }
            }
        }),
        getProfile: builder.query<IProfileResponse, void>({
            query: () => ({
                url: "Profile",
                method: "GET",
            }),
            providesTags: ["Account"],
        }),
    }),
});

export const {useRegisterMutation, useLoginMutation, useGetProfileQuery} = apiAccount;