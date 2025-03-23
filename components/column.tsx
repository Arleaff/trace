"use client";

import { CompletionLevel, Media } from '@/app/home';
import { useDroppable } from '@dnd-kit/core';
import { memo } from 'react';
import { VList } from 'virtua';
import { MediaCard } from './media-card';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetMediaQuery } from '@/apiSlice';



export const CompletionLevelColumn = memo(function CompletionLevelColumn({ completionLevel, hoverColor }: 
    {
        completionLevel: CompletionLevel, hoverColor: string,
}) {


    const { setNodeRef, isOver } = useDroppable({
        id: completionLevel,
    });

    const categoryStyle: React.CSSProperties = {
        backgroundColor: isOver ? hoverColor : "white",
        transition: "background-color ease-in-out .5s",
    };

    return (
        // TODO: apply min width at a higher level
        // overflow-x-hidden prevents break on rerender
        <div id={completionLevel} ref={setNodeRef} style={categoryStyle} className="flex flex-1 flex-col p-2 rounded-xl overflow-x-hidden min-w-56">
            
            <span onClick={ () => {
                // setGridView(onFilter(completionLevel as CompletionLevel) != null) // call filter function and use value to set column view
            }} 
                className="border rounded-lg w-fit px-5 hover:cursor-pointer bg-white mb-3 select-none"
            >{completionLevel}</span>
            

            <VItems completionLevel={completionLevel}></VItems>

            
            
            
        </div>
    );
})


const VItems = memo(function VItems({completionLevel}: {completionLevel: CompletionLevel}) {

    const list = useSelector((state: RootState) => state.media.currentList)
    const { data: media } = useGetMediaQuery(list)

    const sort = useSelector((state: RootState) => state.media.sort)
    const search = useSelector((state: RootState) => state.media.search)
    

    const formatMedia = function formatMedia() {
        let formattedMedia: Media[] = (media ?? []).filter(media => media.completionLevel == completionLevel)

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


    return (
        <VList
            // ref={CategoryInfo[completionLevel].ref}
            className="no-scrollbar h-full overflow-y-scroll flex flex-col" >
            {formatMedia().map((media) =>
                <MediaCard media={media} key={media.title}
                />
            )}
        </VList>
    )
})