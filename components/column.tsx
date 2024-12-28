"use client";

import { useDroppable } from '@dnd-kit/core';


export default function CategoryColumn({ children, categoryName, hoverColor }: { children?: React.ReactNode, categoryName: string, hoverColor: string }) {
    const { isOver, setNodeRef } = useDroppable({
        id: categoryName,
    });
    const style: React.CSSProperties = {
        backgroundColor: isOver ? hoverColor : "white",
        transition: "all ease-in-out .5s"
    };

    return (
        <div id={categoryName} ref={setNodeRef} style={style } className="flex flex-col flex-1 p-2">
            <span className=" border rounded-lg w-fit px-5 hover:cursor-pointer bg-white mb-3">{categoryName}</span>
            {children}
        </div>
    );
}