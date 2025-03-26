import { createApi, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from '@reduxjs/toolkit/query/react'
import { addList, addMedia, deleteList, deleteMedia, editList, editMedia, getLists, getMedia } from "./db";
import { COMPLETION_LEVELS, Media } from './app/home';


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
    tagTypes: ['Lists', 'Media'],

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
            providesTags: ["Lists"]
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
            invalidatesTags: ["Lists"]
        }),

        editList: build.mutation<string, { old: string, new: string }>({
            queryFn: async (payload: { old: string, new: string }): Promise<QueryReturnValue<string, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await editList(payload.old, payload.new)

                    // Return the result in an object with a `data` field
                    return { data: payload.new }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["Lists"],
            onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
                // Optimistic update example
                const patchResult = dispatch(
                    mediaAPI.util.updateQueryData('getLists', undefined, (draft) => {
                        const listIndex = draft.findIndex(list => list === payload.old);
                        if (listIndex !== -1) {
                            draft[listIndex] = payload.new;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        deleteList: build.mutation<string, string>({
            queryFn: async (payload: string): Promise<QueryReturnValue<string, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await deleteList(payload)

                    // Return the result in an object with a `data` field
                    return { data: payload }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["Lists"],
            onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
                // Optimistic update example
                const patchResult = dispatch(
                    // function, arguments, update recipe
                    mediaAPI.util.updateQueryData('getLists', undefined, (draft) => {
                        const index = draft.findIndex(list => list === payload);
                        if (index !== -1) draft.splice(index, 1);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
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


        addMedia: build.mutation<Media, { list: string, media: Media }>({
            queryFn: async (payload: { list: string, media: Media }): Promise<QueryReturnValue<Media, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await addMedia(payload.list, payload.media)
                    // Return the result in an object with a `data` field
                    return { data: payload.media }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["Media"]
        }),

        editMedia: build.mutation<Media, { old: Media, new: Media, list: string }>({
            queryFn: async (payload: { old: Media, new: Media, list: string }): Promise<QueryReturnValue<Media, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await editMedia(payload.list, payload.old, payload.new)

                    // Return the result in an object with a `data` field
                    return { data: payload.new }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["Media"],
            onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
                // Optimistic update example
                const patchResult = dispatch(
                    mediaAPI.util.updateQueryData('getMedia', payload.list, (draft) => {
                        const mediaIndex = draft.findIndex(media => media.title === payload.old.title);
                        if (mediaIndex !== -1) {
                            draft[mediaIndex] = payload.new;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        deleteMedia: build.mutation<Media, { list: string, media: Media }>({
            queryFn: async (payload: { list: string, media: Media }): Promise<QueryReturnValue<Media, FetchBaseQueryError, FetchBaseQueryMeta>> => {
                try {
                    await deleteMedia(payload.list, payload.media)

                    // Return the result in an object with a `data` field
                    return { data: payload.media }
                } catch (error) {
                    // Catch any errors and return them as an object with an `error` field
                    return { error: { status: "CUSTOM_ERROR", data: error, error: error as string ?? "" } };
                }
            },
            invalidatesTags: ["Media"],
            onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
                // Optimistic update example
                const patchResult = dispatch(
                    // function that's supposed to be called, arguments supplied, pretend update recipe
                    mediaAPI.util.updateQueryData('getMedia', payload.list, (draft) => {
                        const index = draft.findIndex(media => media === payload.media);
                        if (index !== -1) draft.splice(index, 1);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),


    }),
})

export const { useGetListsQuery, useGetMediaQuery, useAddListMutation, useEditMediaMutation, useDeleteListMutation, useEditListMutation, useAddMediaMutation, useDeleteMediaMutation } = mediaAPI

