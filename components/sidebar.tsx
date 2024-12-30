import Image from "next/image"
import { useState } from "react";

export default function SideBar() {

    const [ open, setOpen ] = useState(false);

    const style: React.CSSProperties = {
        width: "200px",
        marginLeft: open ? "0px" : "-200px",
        transition: "all ease .5s",
    }

    return (
        <div className="flex-none flex flex-row items-start transition-all">
            <div className="px-4 box-border mt-14" style={style}>
                <ul>
                    <li>List 1</li>
                    <li>List 2</li>
                    <li>List 3</li>
                </ul>
            </div>
            <Image 
                className="dark:invert hover:cursor-pointer m-2 box-border" src="/menu.svg" alt="Menu" width={40} height={40} 
                onClick={ () => {
                    setOpen(!open)
                }}
            />
        </div>
    );
}