import { configureStore } from '@reduxjs/toolkit'
import { mediaReducer, searchReducer, sortReducer } from '@/mediaSlice'


export const store =  configureStore({
    reducer: {
        media: mediaReducer,
        search: searchReducer,
        sort: sortReducer
    }
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']