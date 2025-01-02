"use client"

import CompletionLevelColumn from "@/components/column";
import MediaCard, { StaticMediaCard } from "@/components/media-card";
import SideBar from "@/components/sidebar";
import { MEDIA_LISTS } from "@/data";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { RefObject, useEffect, useRef, useState } from "react";
import { VList, VListHandle } from "virtua";

export default function Home() {

  const [filter, setFilter] = useState<CompletionLevels | null>(null)

  const currentList = MEDIA_LISTS[0].media

  function formatMedia(media: media[]) {
    // for filter, search, and sort later on
    // .filter( media => media.title.includes("0"))
    return media.sort((a, b) => a.title.localeCompare(b.title))
  }

  
  const [unstarted, setUnstarted] = useState(formatMedia(currentList.filter(media => media.completionLevel == "Unstarted")))

  const [ongoing, setOngoing] = useState(formatMedia(currentList.filter(media => media.completionLevel == "Ongoing")))

  const [finished, setFinished] = useState(formatMedia(currentList.filter(media => media.completionLevel == "Finished")))

  const [dropped, setDropped] = useState(formatMedia(currentList.filter(media => media.completionLevel == "Dropped")))

  const media: MediaMap = {
    "Unstarted": {
      hoverColor: "rgb(128 128 128 / .1)",
      media: unstarted,
      setMedia: setUnstarted,
      ref: useRef<VListHandle>(null)
    },
    "Ongoing": {
      hoverColor: "rgb(82 204 207 / .2)",
      media: ongoing,
      setMedia: setOngoing,
      ref: useRef<VListHandle>(null)
    },
    "Finished": {
      hoverColor: "rgb( 64 201 103 / .15)",
      media: finished,
      setMedia: setFinished,
      ref: useRef<VListHandle>(null)
    },
    "Dropped": {
      hoverColor: "rgb(243 16 141 / .1)",
      media: dropped,
      setMedia: setDropped,
      ref: useRef<VListHandle>(null)
    },
  }




  const [activeMedia, setActiveMedia] = useState<media | null>(null);  

  function customCoordinatesGetter(event: { code: any; }, args: any) {

    
    const { currentCoordinates } = args;
    

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

  // animate rating circle on load
  useEffect(() => {
    const circleProgress = document.querySelectorAll(".progress");

    const progressAnimation: Keyframe[] = [
      { strokeDashoffset: "157.07963267948966" },
      {},
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

  const [currentIndex, setCurrentIndex] = useState(-1)

  



  return (
    // w-dvw is needed for something..?
    <div className="flex flex-row h-dvh ">
      <SideBar></SideBar>
      <div className="flex flex-1 flex-row h-dvh p-4 overflow-y-hidden">

        <DndContext
          sensors={sensors}
          // measuring={measuringConfig}
          collisionDetection={closestCenter}
          onDragStart={
            (event) => {

              const { rating, completionLevel } = (event.active.data.current as { rating: number | null, completionLevel: CompletionLevels })
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
            

            let newCompletionLevel = COMPLETION_LEVELS.find(value => value == overContainer || value == overItems)     
  

            if (completionLevel == newCompletionLevel || !newCompletionLevel) {
              return
            }
            const { media: oldMedia, setMedia: setOldMedia } = media[completionLevel]
            const { media: currentMedia, setMedia: setCurrentMedia, ref } = media[newCompletionLevel]

            setActiveMedia({ title: title as string, rating, completionLevel: newCompletionLevel })

            setOldMedia(oldMedia.filter(media => media.title != title))

            const newMedia = formatMedia([...currentMedia, activeMedia!])
            setCurrentMedia(newMedia)

            ref.current?.scrollToIndex(newMedia.indexOf(activeMedia!))

          }}
        >


          {

            COMPLETION_LEVELS.map(completionLevel =>
              ((filter == null || filter == completionLevel) &&




                <SortableContext
                  key={completionLevel}
                  id={completionLevel}
                items={media[completionLevel].media.map((item) => item.title)}
                  strategy={verticalListSortingStrategy}
                  disabled={filter != null}

                >
                  <CompletionLevelColumn
                    VListRef={media[completionLevel].ref}
                    hover={activeMedia?.completionLevel == completionLevel}
                    onFilter={() => {
                      const newFilter: CompletionLevels | null = filter ? null : completionLevel as CompletionLevels

                      setFilter(newFilter as CompletionLevels)
                      return newFilter
                    }}
                    completionLevel={completionLevel} key={completionLevel} hoverColor={media[completionLevel].hoverColor
                    }>
                      
                  {media[completionLevel].media.map((media) => <MediaCard completionLevel={completionLevel} title={media.title} rating={media.rating} key={media.title} ></MediaCard>)}
           
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
    setMedia: any,
    ref: RefObject<VListHandle | null>
  }
}

