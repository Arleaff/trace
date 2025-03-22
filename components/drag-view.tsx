import { COMPLETION_LEVELS, CompletionLevel, Media, MediaSort } from "@/app/home";
import { AppDispatch, RootState } from "@/app/store";
import { CompletionLevelColumn } from "@/components/column";
import { replaceMedia } from "@/mediaSlice";

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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
        "Pending": {
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
        let newCompletionLevel = event.over?.id as CompletionLevel
        let original = event.active.data.current as Media
        let dragged = { ...event.active.data.current, completionLevel: newCompletionLevel } as Media
        dispatch(replaceMedia([original, dragged]))
    }
    , [])

    return ( <>

        <DndContext
            sensors={sensors}
            // collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <Columns CategoryInfo={CategoryInfo}></Columns>

        </DndContext>

    </>)
}

const Columns = memo(({ CategoryInfo }: { CategoryInfo: MediaMap }) => {
    return (<>
        {COMPLETION_LEVELS.map(completionLevel =>
            <CompletionLevelColumn 
                completionLevel={completionLevel} key={completionLevel} hoverColor={CategoryInfo[completionLevel].hoverColor}
            />
        )}
    </>)
})