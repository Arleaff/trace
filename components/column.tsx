"use client";

import { CompletionLevels } from '@/app/page';
import { useDroppable } from '@dnd-kit/core';
import { RefObject, useState } from 'react';
import { VList, VListHandle } from 'virtua';


export default function CompletionLevelColumn({ children, completionLevel, hoverColor, hover, onFilter, VListRef }: 
    {
        children?: React.ReactNode, completionLevel: string, hoverColor: string, onFilter: () => CompletionLevels | null, hover: boolean,
        VListRef: RefObject<VListHandle | null>

}) {

    const [ gridView, setGridView ] = useState(false)

    const { setNodeRef } = useDroppable({
        id: completionLevel,
    });

    const categoryStyle: React.CSSProperties = {
        backgroundColor: hover ? hoverColor : "white",
        transition: "background-color ease-in-out .5s",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        justifyItems: "center"


    };    


    return (
        // TODO: apply min width at a higher level
        // overflow-x-hidden prevents break on rerender
        <div id={completionLevel} ref={setNodeRef} style={categoryStyle} className="flex flex-1 flex-col p-2 rounded-xl overflow-x-hidden min-w-56">
            
            <span onClick={ () => {
                setGridView(onFilter() != null) // call filter function and use value to set column view
            }} 
                className="border rounded-lg w-fit px-5 hover:cursor-pointer bg-white mb-3 select-none"
            >{completionLevel}</span>
            

            { 
                gridView ? 
                    // consider virtualized grid using the same library
                    <div
                        style={gridStyle}
                        className='gap-3'
                    >
                        {children}
                    </div>
                :
                    <VList
                        ref={VListRef}
                        className='no-scrollbar h-full overflow-y-scroll'>
                        {children}
                    </VList>

            }
            
            
            
        </div>
    );
}