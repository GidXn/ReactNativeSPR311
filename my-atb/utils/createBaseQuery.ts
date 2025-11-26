import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "@/constants/Urls";
import {getSecureStore} from "@/utils/secureStore";

export const createBaseQuery = (endpoint: string) => {
    return fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/${endpoint}`,
        prepareHeaders: (headers) => {
            const token = getSecureStore('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    });
};