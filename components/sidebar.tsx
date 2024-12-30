import Image from "next/image"
import { useState } from "react";

export default function SideBar() {

    const [open, setOpen] = useState(false);

    const sideBarContentStyle: React.CSSProperties = {
        opacity: open ? "1" : 0,
        overflow: "hidden",


        // optional width transition
        width: open ? "250px" : "0px",
        transition: "width ease-in-out .5s",

    }

    const sidebarStyle: React.CSSProperties = {
        width: open ? "250px" : "72px",
        transition: "width ease-in-out .5s",
    }



    return (
        <div className="flex-none flex flex-col border-r text-nowrap shadow-md" style={sidebarStyle}>

            <Image
                className="dark:invert hover:cursor-pointer box-border mx-4 my-2 self-end size-10" src="/menu.svg" alt="Menu" width={40} height={40}
                onClick={() => {
                    setOpen(!open)
                }}
            />

            <ul className="flex flex-col px-2 box-border gap-2" style={sideBarContentStyle}>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md border px-2">Media 1</li>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md border px-2">Media 2</li>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md border px-2">Media 3</li>
            </ul>

        </div>
    );
}