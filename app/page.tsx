"use client"

import CompletionLevelColumn from "@/components/column";
import MediaCard, { StaticMediaCard } from "@/components/media-card";
import SideBar from "@/components/sidebar";
import { MEDIA_LISTS } from "@/data";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DropAnimationSideEffects, KeyframeResolver } from "@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

import { useEffect, useState } from "react";
import { VList } from "virtua";

export default function Home() {

  const [filter, setFilter] = useState<CompletionLevels | null>(null)

  

  const currentList = MEDIA_LISTS[0].media

  const [unstarted, setUnstarted] = useState(currentList.filter(media => media.completionLevel == "Unstarted"))

  const [ongoing, setOngoing] = useState(currentList.filter(media => media.completionLevel == "Ongoing"))

  const [finished, setFinished] = useState(currentList.filter(media => media.completionLevel == "Finished"))

  const [dropped, setDropped] = useState(currentList.filter(media => media.completionLevel == "Dropped"))


  const media: MediaMap = {
    "Unstarted": {
      hoverColor: "rgb(128 128 128 / .1)",
      media: unstarted,
      setMedia: setUnstarted
    },
    "Ongoing": {
      hoverColor: "rgb(82 204 207 / .2)",
      media: ongoing,
      setMedia: setOngoing
    },
    "Finished": {
      hoverColor: "rgb( 64 201 103 / .15)",
      media: finished,
      setMedia: setFinished
    },
    "Dropped": {
      hoverColor: "rgb(243 16 141 / .1)",
      media: dropped,
      setMedia: setDropped
    },
  }




  const [activeMedia, setActiveMedia] = useState<{ title: string, rating: number | undefined, completionLevel: string } | null>(null);

  // console.log(activeMedia);
  

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    }
  };

  function customCoordinatesGetter(event: { code: any; }, args: any) {

    
    const { currentCoordinates } = args;

    // console.log(event);
    
    console.log(args.context.active.data.current.completionLevel);
    

    const delta = 50;

    switch (event.code) {
      case 'ArrowRight':
        return {
          ...currentCoordinates,
          x: currentCoordinates.x + delta,
        };
      case 'ArrowLeft':
        return {
          ...currentCoordinates,
          x: currentCoordinates.x - delta,
        };
      case 'ArrowDown':
        return {
          ...currentCoordinates,
          y: currentCoordinates.y + delta,
        };
      case 'ArrowUp':
        return {
          ...currentCoordinates,
          y: currentCoordinates.y - delta,
        };
    }

    return undefined;
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: customCoordinatesGetter,
    })
  );

  useEffect(() => {
    const circleProgress = document.querySelectorAll(".progress");

    const progressAnimation: Keyframe[] = [
      { strokeDashoffset: "157.07963267948966" },
      { strokeDashoffset: "" },
    ];

    const progressTiming: KeyframeAnimationOptions = {
      duration: 500,
      iterations: 1,
      easing: "ease-in-out",
      delay: 0
    };

    circleProgress.forEach((node) => {
      node.animate(progressAnimation, progressTiming)
    })

  }, [])


  return (
    // w-dvw is needed for something..?
    <div className="flex flex-row h-dvh ">
      <SideBar></SideBar>
      <div className="flex flex-1 flex-row h-dvh p-4 overflow-y-hidden">

        <DndContext
          sensors={sensors}
          // measuring={measuringConfig}
          collisionDetection={closestCenter}
          // autoScroll={false}
          onDragStart={
            (event) => {

              const { rating, completionLevel } = (event.active.data.current as { rating: number | undefined, completionLevel: string })
              const title = event.active.id
              setActiveMedia({ title: title as string, rating, completionLevel })
            }
          }
          onDragEnd={
            (event) => {
              setActiveMedia(null)
            }
          }
          onDragOver={(event) => {            
            const { completionLevel, rating } = activeMedia!
            

            const title = event.active.id

            const overContainer = event.over?.id
            const overItems = event.over?.data.current?.completionLevel
            

            let newCompletionLevel: CompletionLevels | null = null


            if (COMPLETION_LEVELS.includes(overContainer as CompletionLevels)) {
              newCompletionLevel = overContainer as CompletionLevels
              
              
            }
            else if (COMPLETION_LEVELS.includes(overItems as CompletionLevels)) {
              newCompletionLevel = overItems
            }            
  

            if (completionLevel == newCompletionLevel || newCompletionLevel == null) {
              return
            }
            const { media: oldMedia, setMedia: setOldMedia } = media[completionLevel]
            const { media: newMedia, setMedia: setNewMedia } = media[newCompletionLevel]

            setActiveMedia({ title: title as string, rating, completionLevel: newCompletionLevel })

            setOldMedia(oldMedia.filter(media => media.title != title))
            setNewMedia([...newMedia, { title, rating, completionLevel }])
          }}
        >


          {

            COMPLETION_LEVELS.map(completionLevel =>
              ((filter == null || filter == completionLevel) &&




                <SortableContext
                  key={completionLevel}
                  id={completionLevel}
                  items={media[completionLevel].media.sort((a, b) => a.title.localeCompare(b.title)).map((item) => item.title)}
                  strategy={verticalListSortingStrategy}

                >
                  <CompletionLevelColumn
                    hover={activeMedia?.completionLevel == completionLevel}
                    onFilter={() => {
                      const newFilter: CompletionLevels | null = filter ? null : completionLevel as CompletionLevels

                      setFilter(newFilter as CompletionLevels)
                      return newFilter
                    }}
                    completionLevel={completionLevel} key={completionLevel} hoverColor={media[completionLevel].hoverColor
                    }>
                    {media[completionLevel].media.sort((a, b) => a.title.localeCompare(b.title)).map((media) => <MediaCard completionLevel={completionLevel} title={media.title} rating={media.rating} key={media.title} ></MediaCard>)}
           
                  </CompletionLevelColumn>
                </SortableContext>

              
            )



            )
          }
          <DragOverlay>
            {activeMedia && <StaticMediaCard title={activeMedia.title} rating={activeMedia.rating} ></StaticMediaCard>}
          </DragOverlay>

        </DndContext>


      </div>
    </div>
  );
}

export const COMPLETION_LEVELS = ['Unstarted', 'Ongoing', 'Finished', 'Dropped'] as const;
export type CompletionLevels = typeof COMPLETION_LEVELS[number];

// export type CompletionLevels =
//   | 'Unstarted'
//   | 'Ongoing'
//   | 'Finished'
//   | 'Dropped'

export type media = {
  title: string;
  rating: null | number;
  completionLevel: CompletionLevels;
}

interface MediaMap {
  [key: string]: {
    hoverColor: string,
    media: media[],
    setMedia: any
  }
}

