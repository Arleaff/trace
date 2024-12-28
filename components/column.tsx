"use client";

import { useDroppable } from '@dnd-kit/core';


export default function CategoryColumn({ children, categoryName, hoverColor }: { children?: React.ReactNode, categoryName: string, hoverColor: string }) {
    const { isOver, setNodeRef } = useDroppable({
        id: categoryName,
    });
    const style: React.CSSProperties = {
        backgroundColor: hoverColor,
    };

    // or any other unique string

    return (
        <div id={categoryName} ref={setNodeRef} style={isOver ? style : undefined } className="flex flex-col gap-3 flex-1 p-2">
            <span className=" border rounded-lg w-fit px-5 hover:cursor-pointer bg-white">{categoryName}</span>
            {children}
        </div>
    );
}