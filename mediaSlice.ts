import { createSlice } from '@reduxjs/toolkit'
import { CompletionLevel, DialogOptions, Media, MediaSort } from './app/home';


export const mediaSlice = createSlice({
    name: 'media',
    initialState: {
        allLists: [] as string[],
        currentList: "",
        sort: "highest_rating" as MediaSort,
        search: "",
        filter: null as CompletionLevel | null,
        dialog: null as DialogOptions | null
    },
    reducers: {
        setCurrentList: (state, action) => {
            state.currentList = action.payload
        },

        setDialog: (state, action) => {
            state.dialog = action.payload
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
export const { setCurrentList, setSort, setSearch,  setDialog } = mediaSlice.actions


export const mediaReducer = mediaSlice.reducer