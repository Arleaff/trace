import { createSlice } from '@reduxjs/toolkit'
import { MEDIA_LISTS } from "@/data";
import { Media, MediaSort } from './app/home';

export const mediaSlice = createSlice({
    name: 'media',
    initialState: {
        value: MEDIA_LISTS[0].media
    },
    reducers: {
        editMedia: (state, action) => {
            let dragged = action.payload
            state.value = state.value.map((media) => media.title == dragged?.title ? dragged : media)
        }
    }
})

export const sortSlice = createSlice({
    name: 'sort',
    initialState: {
        value: "highest_rating" as MediaSort
    },
    reducers: {
        setSort: (state, action) => {
            state.value = action.payload
        }
    }
})

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        value: ""
    },
    reducers: {
        setSearch: (state, action) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { editMedia } = mediaSlice.actions
export const { setSort } = sortSlice.actions
export const { setSearch } = searchSlice.actions


export const mediaReducer = mediaSlice.reducer
export const sortReducer = sortSlice.reducer
export const searchReducer = searchSlice.reducer