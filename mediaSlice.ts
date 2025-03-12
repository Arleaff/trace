import { createSlice, current } from '@reduxjs/toolkit'
import { CompletionLevel, Media, MediaSort } from './app/home';

export const mediaSlice = createSlice({
    name: 'media',
    initialState: {
        currentMedia: [] as Media[],
        currentList: "",
        sort: "highest_rating" as MediaSort,
        search: "",
        filter: null as CompletionLevel | null
    },
    reducers: {
        setCurrentList: (state, action) => {
            state.currentList = action.payload
        },
        replaceMedia: (state, action) => {
            let original = action.payload[0]
            let edited = action.payload[1]
            let newList = state.currentMedia.map((media) => media.title == original?.title ? edited : media)

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
        },
        initializeMedia: (state, action) => {
            state.currentMedia = action.payload
        },
        deleteMedia: (state, action) => {
            let newList = state.currentMedia.filter((media) => media.title != action.payload?.title)

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
        },
        addMedia: (state, action) => {
            let newList = [...state.currentMedia, action.payload]

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
        },

        


        setSort: (state, action) => {
            state.sort = action.payload
        },

        setSearch: (state, action) => {
            state.search = action.payload
        }
    }
})



// Action creators are generated for each case reducer function
export const { replaceMedia, initializeMedia, setCurrentList, setSort, setSearch, deleteMedia, addMedia } = mediaSlice.actions


export const mediaReducer = mediaSlice.reducer