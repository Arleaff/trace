import { configureStore } from '@reduxjs/toolkit'
import { mediaReducer } from '@/mediaSlice'
import { mediaAPI } from '@/apiSlice'
import { setupListeners } from '@reduxjs/toolkit/query/react'


export const store =  configureStore({
    reducer: {
        media: mediaReducer,
        [mediaAPI.reducerPath]: mediaAPI.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(mediaAPI.middleware),
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

setupListeners(store.dispatch)