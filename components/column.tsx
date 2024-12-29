"use client";

import { CategoryFilter } from '@/app/page';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';


export default function CategoryColumn({ children, categoryName, hoverColor, onFilter }: 
    { children?: React.ReactNode, categoryName: string, hoverColor: string,  onFilter: () => CategoryFilter 

}) {

    const [ columnView, setColumnView ] = useState(true)

    const { isOver, setNodeRef } = useDroppable({
        id: categoryName,
    });

    const style: React.CSSProperties = {
        backgroundColor: isOver ? hoverColor : "white",
        transition: "all ease-in-out .5s",
    };

    return (
        <div id={categoryName} ref={setNodeRef} style={style} className="flex flex-col p-2 w-screen">
            <span onClick={ () => {
                setColumnView(onFilter() != CategoryFilter.All) // call filter function and use value to set column view
            }} 
            className=" border rounded-lg w-fit px-5 hover:cursor-pointer bg-white mb-3"
        >{categoryName}</span>

            <div className=' no-scrollbar h-dvh overflow-y-scroll'>
                <div className='flex flex-col flex-nowrap gap-3'>
                    {children}
                </div>
            </div>
            
            
        </div>
    );
}