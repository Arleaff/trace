import { createApi, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from '@reduxjs/toolkit/query/react'
import { addList, getLists, getMedia } from "./db";
import { COMPLETION_LEVELS, Media } from './app/home';
import { replaceMedia } from './mediaSlice';


// async function neonBaseQuery({query:}) {

//     // ✅ Catch errors and _return_ them so the RTKQ logic can track it
//     try {
//         const { user } = await getCurrentSession();
//         const sql = neon(process.env.DATABASE_URL || "");
//         const data = await fetchSomeData()
//         return { data }
//     } catch (error) {
//         return { error }
//     }
// }

export const mediaAPI = createApi({
    reducerPath: 'mediaAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['List', 'Media'],

    endpoints: (build) => ({
        getLists: build.query<string[], void>({
            queryFn: async (): Promise<QueryReturnValue<string[], FetchBaseQueryError, FetchBaseQueryMeta>> => {     
                try {
                    const lists = (await getLists()).map(l => l.name as string)
                    // Return the result in an object with a `data` field
                    return { data: lists }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            providesTags: ["List"]
        }),

        addList: build.mutation<string, string>({
            queryFn: async (newListName: string): Promise<QueryReturnValue<string, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await addList(newListName)
                    // Return the result in an object with a `data` field
                    return { data: newListName }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["List"]
        }),

        getMedia: build.query<Media[], string>({
            queryFn: async (list: string): Promise<QueryReturnValue<Media[], FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    const result = await getMedia(list)
                    // Return the result in an object with a `data` field
                    return { data: result.map(m => ({ title: m.title, rating: m.rating, completionLevel: COMPLETION_LEVELS[m.category]} as Media)) }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            providesTags: ["Media"]
        }),

        replaceMedia: build.mutation<Media, { original: Media, new: Media}>({
            queryFn: async (media: { original: Media, new: Media }): Promise<QueryReturnValue<Media, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    
                    // Return the result in an object with a `data` field
                    return { data: {} as Media }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            }, 
            invalidatesTags: ["Media"]
        }),


    }),
})

export const { useGetListsQuery, useGetMediaQuery, useAddListMutation } = mediaAPI

