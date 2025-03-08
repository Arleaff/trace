import { COMPLETION_LEVELS, CompletionLevel, Media, MediaSort } from "@/app/home";
import { AppDispatch, RootState } from "@/app/store";
import { CompletionLevelColumn } from "@/components/column";
import { editMedia } from "@/mediaSlice";

import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { memo, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VList, VListHandle } from "virtua";


interface MediaMap {
    [key: string]: {
        hoverColor: string,
        ref: RefObject<VListHandle | null>
    }
}

export default function DragView() {

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

    // const dispatch: AppDispatch = useDispatch()


    const sensors = useSensors(
        useSensor(PointerSensor, {
        activationConstraint: { distance: 1 }
        }),
    );

    const dispatch: AppDispatch = useDispatch()

    const onDragEnd = useCallback((event: DragEndEvent) => {
        console.log("end");
        
        let newCompletionLevel = event.over?.id as CompletionLevel
        let dragged = { ...event.active.data.current, completionLevel: newCompletionLevel } as Media
        dispatch(editMedia(dragged))
        // CategoryInfo[newCompletionLevel].ref.current?.scrollToIndex(formatMedia(newCompletionLevel).indexOf(dragged))

    }
    , [])

    const onDragOver = useCallback((event: DragOverEvent) => {

        }
    , [])


    const onDragStart = useCallback((event: DragStartEvent) => {
        // const title = event.active.id
        // setActiveMedia(mediaList.find(m => m.title == title)!.title)
    }
    , [])


    const onFilter = useCallback(
        (completionLevel: CompletionLevel) => {
            const newFilter: CompletionLevel | null = filter ? null : completionLevel as CompletionLevel

            setFilter(newFilter as CompletionLevel)
            return newFilter
        }
    , [filter])

    const Columns = memo(() => {
        return (<>
            {COMPLETION_LEVELS.map(completionLevel => ((filter == null || filter == completionLevel) &&
                <CompletionLevelColumn
                    onFilter={onFilter}
                    completionLevel={completionLevel} key={completionLevel} hoverColor={CategoryInfo[completionLevel].hoverColor}
                >

                </CompletionLevelColumn>
            ))}
        </>)
    })


    return ( <>

        <DndContext
            sensors={sensors}
            // collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <Columns></Columns>

        </DndContext>

    </>)
}