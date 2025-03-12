import { AppDispatch } from "@/app/store";
import { initializeMedia, setCurrentList } from "@/mediaSlice";
import Image from "next/image"
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SideBar() {

    const [open, setOpen] = useState(false);

    const sideBarContentStyle: React.CSSProperties = {
        opacity: open ? "1" : 0,
        overflow: "hidden",

        width: open ? "250px" : "0px",
        transition: "width ease-in-out .5s",

    }

    const sidebarStyle: React.CSSProperties = {
        width: open ? "250px" : "72px",
        transition: "width ease-in-out .5s",
    }

    const [lists, setLists] = useState([]);

    useEffect( () => {
        // get lists from local storage
        setLists(JSON.parse(localStorage.getItem("lists") ?? "[]"))
    }, [])



    return (
        <div className="flex-none flex flex-col border-r text-nowrap shadow-md" style={sidebarStyle}>

            <Image
                className="dark:invert hover:cursor-pointer box-border mx-4 my-2 self-end size-10" src="/menu.svg" alt="Menu" width={40} height={40}
                onClick={() => {
                    setOpen(!open)
                }}
            />

            <ul className="flex flex-col px-2 box-border gap-2" style={sideBarContentStyle}>
                {
                    lists.map((list: string) => 
                        <MediaList key={list} listName={list}></MediaList>
                    )
                }
            </ul>

        </div>
    );
}

const MediaList = memo(function({listName} : {listName: string}) {

    const dispatch: AppDispatch = useDispatch()

    const setList = useCallback( () => {
        dispatch(setCurrentList(listName))
        dispatch(initializeMedia(JSON.parse(localStorage.getItem(listName) ?? "")))

        //TODO: dynamic route and handle stack pop MAYBE
        // window.history.pushState({}, '', `/${listName}`);
    },
    [])

    return (
        <li onClick={setList} className="hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md border px-2">{listName}</li>
    )
})