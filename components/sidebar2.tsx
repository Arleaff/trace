import Image from "next/image"
import { useState } from "react";

export default function SideBar() {

    const [ open, setOpen ] = useState(false);

    const style: React.CSSProperties = {
        width: open ? "200px" : "0px",
        opacity: open ? "1" : "0",

        transition: open ? "width ease .4s, opacity ease .00001s .3s" : "width ease .5s",

    }

    return (
        <div className="flex-none flex flex-col border-r text-nowrap">
            
            <Image
                className="dark:invert hover:cursor-pointer box-border mx-4 my-2 self-end size-10" src="/menu.svg" alt="Menu" width={40} height={40}
                onClick={() => {
                    setOpen(!open)
                }}
            />

            <ul className=" px-2" style={style}>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md px-2">Media 1</li>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md px-2">Media 2</li>
                <li className=" hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md px-2">Media 3</li>
            </ul>

        </div>
    );
}