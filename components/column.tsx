"use client";

import { CompletionLevel, Media } from '@/app/home';
import { useDroppable } from '@dnd-kit/core';
import { memo, RefObject, useState } from 'react';
import { VList, VListHandle } from 'virtua';
import { MediaCard } from './media-card';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';



export const CompletionLevelColumn = function CompletionLevelColumn({ children, completionLevel, hoverColor, onFilter, onEdit, onDelete }: 
    {
        children?: React.ReactNode, completionLevel: string, hoverColor: string, onFilter: (lvl: CompletionLevel) => CompletionLevel | null,
        onEdit: (newMedia: Media, originalMedia: Media | undefined) => any, onDelete: (originalMedia: Media | undefined) => any
}) {

    const media = useSelector((state: RootState) => state.media.value)
    const sort = useSelector((state: RootState) => state.sort.value)
    const search = useSelector((state: RootState) => state.search.value)
    const dispatch: AppDispatch = useDispatch()

    const formatMedia = function formatMedia() {
        let formattedMedia: Media[] = media.filter(media => media.completionLevel == completionLevel)

        if (search.trim().length != 0) {
            formattedMedia = formattedMedia.filter(media => media.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        }

        switch (sort) {

            case 'alphabetical':
                return formattedMedia.sort((a, b) => a.title.localeCompare(b.title))
            default:
            case "highest_rating":
                return formattedMedia.sort((a, b) => {
                    // nulls sort after anything else
                    if (a.rating === null) {
                        return 1;
                    }
                    if (b.rating === null) {
                        return -1;
                    }

                    return b.rating - a.rating
                })
        }
        // return formattedMedia
    }

    const [ gridView, setGridView ] = useState(false)

    const { setNodeRef, isOver } = useDroppable({
        id: completionLevel,
    });

    const categoryStyle: React.CSSProperties = {
        backgroundColor: isOver ? hoverColor : "white",
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
                setGridView(onFilter(completionLevel as CompletionLevel) != null) // call filter function and use value to set column view
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
                // TODO: see if height changes performance
                    <div className='no-scrollbar h-full overflow-y-scroll flex flex-col'
>
                        <VList 
                            // ref={CategoryInfo[completionLevel].ref}
                            className="no-scrollbar h-full overflow-y-scroll flex flex-col" >
                            {formatMedia().map((media) =>
                                <MediaCard media={media} key={media.title}
                                    onEdit={onEdit} onDelete={onDelete} />
                            )}
                        </VList>
                </div>
                    

            }
            
            
            
        </div>
    );
}