import { COMPLETION_LEVELS, CompletionLevel, Media, MediaSort } from "@/app/home";
import { CompletionLevelColumn } from "@/components/column";
import { MEDIA_LISTS } from "@/data";

import { DndContext, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { VList, VListHandle } from "virtua";
import { MediaCard } from "./media-card";

interface MediaMap {
    [key: string]: {
        hoverColor: string,
        ref: RefObject<VListHandle | null>
    }
}

export default function DragView({search, sort} : {search: string, sort: MediaSort}) {

    const CategoryInfo: MediaMap = {
        "Unstarted": {
            hoverColor: "rgb(128 128 128 / .1)",
            ref: useRef<VListHandle>(null)
        },
        "Ongoing": {
            hoverColor: "rgb(82 204 207 / .2)",
            ref: useRef<VListHandle>(null)
        },
        "Finished": {
            hoverColor: "rgb( 64 201 103 / .15)",
            ref: useRef<VListHandle>(null)
        },
        "Dropped": {
            hoverColor: "rgb(243 16 141 / .1)",
            ref: useRef<VListHandle>(null)
        },
    }
    
    const [filter, setFilter] = useState<CompletionLevel | null>(null)

    const [mediaList, setMediaList ] = useState(MEDIA_LISTS[0].media)
    // const [activeMedia, setActiveMedia] = useState<string | null>(null);  

    const formatMedia = function formatMedia(completionLevel: string) {
        let formattedMedia: Media[] = mediaList.filter(media => media.completionLevel == completionLevel)        
        
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
    

    const sensors = useSensors(
        useSensor(PointerSensor, {
        activationConstraint: { distance: 1 }
        }),
    );

    const onDragStart = useCallback( (event: DragStartEvent) => {
        // const title = event.active.id
        // setActiveMedia(mediaList.find(m => m.title == title)!.title)
        }
    , [mediaList.length])

    const onDragEnd = useCallback(() => {
        // setActiveMedia(null)
    }
    , [])

    const onDragOver = useCallback((event: DragOverEvent) => {
        console.log(event.active.data.current);


        let activeMedia = event.active.data.current as Media
        const { title, completionLevel, rating } = activeMedia
        

        const overContainer = event.over?.id
        
        let newCompletionLevel = COMPLETION_LEVELS.find(value => value == overContainer)
        console.log(newCompletionLevel);
        


        if (completionLevel == newCompletionLevel || !newCompletionLevel) {  
            return
        }

        setMediaList((prevState) => (prevState.map((media) => media.title == activeMedia?.title ? { ...activeMedia, completionLevel: newCompletionLevel } : media)))
        CategoryInfo[newCompletionLevel].ref.current?.scrollToIndex(formatMedia(newCompletionLevel).indexOf(activeMedia!))

        }
    , [])

    const onEdit = useCallback( (updatedMedia: Media, originalMedia: Media | undefined) => {
        setMediaList((oldList) => oldList.map((oldMedia) => oldMedia.title == originalMedia?.title ? updatedMedia : oldMedia));
    }, [])

    const onDelete = useCallback( (originalMedia: Media | undefined) => {
        setMediaList((oldList) => oldList.filter((oldMedia) => oldMedia.title != originalMedia?.title))
    }, [])

    const onFilter = useCallback(
        (completionLevel: CompletionLevel) => {
            const newFilter: CompletionLevel | null = filter ? null : completionLevel as CompletionLevel

            setFilter(newFilter as CompletionLevel)
            return newFilter
        }
    , [filter])

    return ( <>

        <DndContext
            sensors={sensors}
            // collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            {

                COMPLETION_LEVELS.map(completionLevel =>
                ((filter == null || filter == completionLevel) &&                
                    <CompletionLevelColumn
                        onFilter={onFilter}
                        completionLevel={completionLevel} key={completionLevel} hoverColor={CategoryInfo[completionLevel].hoverColor}
                        // mediaList={formatMedia(completionLevel)}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        >
                        <VList
                            ref={CategoryInfo[completionLevel].ref}
                        >
                            {formatMedia(completionLevel).map((media) =>
                                <MediaCard
                                    media={media}
                                    key={media.title}

                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />)
                            }
                        </VList>
                    </CompletionLevelColumn>

                )

                )
            }

            {/* <DragOverlay>
                {<MediaCard media={{ title: "Control", rating: null, completionLevel: "Unstarted" }} ></MediaCard>}
            </DragOverlay> */}

        </DndContext>

    </>)
}