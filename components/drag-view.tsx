import { useEditMediaMutation } from "@/apiSlice";
import { COMPLETION_LEVELS, CompletionLevel, Media } from "@/app/home";
import { AppDispatch, RootState } from "@/app/store";
import { CompletionLevelColumn } from "@/components/column";
import { replaceMedia } from "@/mediaSlice";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { memo, RefObject, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VListHandle } from "virtua";




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
    
    // const dispatch: AppDispatch = useDispatch()


    const sensors = useSensors(
        useSensor(PointerSensor, {
        activationConstraint: { distance: 1 }
        }),
    );

    const dispatch: AppDispatch = useDispatch()
    const currentList = useSelector((state: RootState) => state.media.currentList)
    

    const [editMedia, result] = useEditMediaMutation()


    const onDragEnd = useCallback((event: DragEndEvent) => {       
        const newCompletionLevel = event.over?.id as CompletionLevel
        const original = event.active.data.current as Media
        const dragged = { ...event.active.data.current, completionLevel: newCompletionLevel } as Media

        editMedia({ old: original, new: dragged, list: currentList})
        

        dispatch(replaceMedia([original, dragged]))
    }
    , [currentList])

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

const Columns = memo(function Columns ({ CategoryInfo }: { CategoryInfo: MediaMap }) {
    return (<>
        {COMPLETION_LEVELS.map(completionLevel =>
            <CompletionLevelColumn 
                completionLevel={completionLevel} key={completionLevel} hoverColor={CategoryInfo[completionLevel].hoverColor}
            />
        )}
    </>)
})
