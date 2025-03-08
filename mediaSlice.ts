import { createSlice, current } from '@reduxjs/toolkit'
import { Media, MediaSort } from './app/home';

export const mediaSlice = createSlice({
    name: 'media',
    initialState: {
        value: [] as Media[],
        currentList: ""
    },
    reducers: {
        setCurrentList: (state, action) => {
            state.currentList = action.payload
        },
        editMedia: (state, action) => {
            let dragged = action.payload
            let newList = state.value.map((media) => media.title == dragged?.title ? dragged : media)

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.value = newList
        },
        setMedia: (state, action) => {
            state.value = action.payload
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
export const { editMedia, setMedia, setCurrentList } = mediaSlice.actions
export const { setSort } = sortSlice.actions
export const { setSearch } = searchSlice.actions


export const mediaReducer = mediaSlice.reducer
export const sortReducer = sortSlice.reducer
export const searchReducer = searchSlice.reducer