import { createSlice } from '@reduxjs/toolkit'
import { CompletionLevel, DialogOptions, Media, MediaSort } from './app/home';

/*

localStorage is used to store an array of all lists (key: "lists")
localStorage is also used to store an array of media for each of these lists (key: name of list, each key being a value of the array above )

localStorage.getItem("lists") -> ["Games", "Movies"]
localStorage.getItem("Games") -> [ {"Minecraft", 10/10, Finished}, etc. ]

*/

export const mediaSlice = createSlice({
    name: 'media',
    initialState: {
        allLists: [] as string[],
        currentMedia: [] as Media[],
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

        replaceMedia: (state, action) => {
            const original = action.payload[0]
            const edited = action.payload[1]
            const newList = state.currentMedia.map((media) => media.title == original?.title ? edited : media)

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
        },
        setMedia: (state, action) => {
            state.currentMedia = action.payload
        },
        deleteMedia: (state, action) => {
            const newList = state.currentMedia.filter((media) => media.title != action.payload?.title)

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
        },
        addMedia: (state, action) => {
            const newList = [...state.currentMedia, action.payload]

            localStorage.setItem(state.currentList, JSON.stringify(newList))
            state.currentMedia = newList
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
export const { replaceMedia, setMedia, setCurrentList, setSort, setSearch, deleteMedia, addMedia, setDialog } = mediaSlice.actions


export const mediaReducer = mediaSlice.reducer