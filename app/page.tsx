"use client"

import CompletionLevelColumn from "@/components/column";
import MediaCard, { StaticMediaCard } from "@/components/media-card";
import SideBar from "@/components/sidebar";
import { MEDIA_LISTS } from "@/data";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CaretSortIcon, ChevronDownIcon, ChevronUpIcon, LetterCaseCapitalizeIcon, MagnifyingGlassIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as Select from "@radix-ui/react-select";

import { RefObject, useEffect, useRef, useState } from "react";
import { VListHandle } from "virtua";

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
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 }
    }),
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

  return (
    // find alternative to overflow hidden
    <div className="flex flex-row h-dvh min-w-0 overflow-hidden">
      <SideBar></SideBar>
      
      <div className="min-w-fit h-full flex flex-col flex-1">
        
        <Toolbar.Root id="toolbar" className="flex flex-none gap-2 justify-center py-2" >
          <div id="search" className="flex items-center border rounded-md px-2">
            <MagnifyingGlassIcon/>
            <input type="text" id="search" className="mx-2 outline-none" autoComplete="off" />
          </div>
          
          <Select.Root
            defaultValue="alphabetical"
            onValueChange={ (value) => {
              console.log(value);
              
            }}
          >
            <Select.Trigger
              id="select"
              className="inline-flex flex-none items-center justify-center gap-[5px] rounded bg-white px-[15px] text-sm leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9"
              aria-label="Food"
            >
              <Select.Icon>
                <CaretSortIcon />
              </Select.Icon>
              <Select.Value placeholder="Sort"/>

            </Select.Trigger>
            <Select.Portal>
              <Select.Content 
                position="popper"
                className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
                style={{width: "var(--radix-select-trigger-width)", maxHeight: "var(--radix-select-content-available-height)"}}
              >
                <Select.Viewport className="p-[5px]">
                  <Select.Item value="alphabetical" className="data-[state=checked]:hidden line-clamp-1 px-2 text-sm">
                    <Select.ItemText>
                      Alphabetical
                    </Select.ItemText>
                  </Select.Item>

                  <Select.Item value="highest_rating" className="data-[state=checked]:hidden data-[state=checked]: line-clamp-1 px-2 text-sm">
                    <Select.ItemText>
                      Highest Rating ffffffffffffffff
                    </Select.ItemText>
                  </Select.Item>

                </Select.Viewport>

              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Toolbar.Separator className="w-px" />

          <Toolbar.Button className="inline-flex items-center gap-1">
            New Item
          </Toolbar.Button>

        </Toolbar.Root>

        <div className="flex flex-row flex-1 p-2 overflow-x-hidden">

          <DndContext
            sensors={sensors}
            // collisionDetection={closestCenter}
            onDragStart={
              (event) => {

                const { rating, completionLevel } = (event.active.data.current as { rating: number | null, completionLevel: CompletionLevels })
                const title = event.active.id
                setActiveMedia({ title: title as string, rating, completionLevel })
              }
            }
            onDragEnd={
              () => {
                setActiveMedia(null)
              }
            }
            onDragOver={(event) => {
              const { completionLevel, rating } = activeMedia!


              const title = event.active.id

              const overContainer = event.over?.id



              let newCompletionLevel = COMPLETION_LEVELS.find(value => value == overContainer)


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

              )

              )
            }

            <DragOverlay>
              {activeMedia && <StaticMediaCard title={activeMedia.title} rating={activeMedia.rating} ></StaticMediaCard>}
            </DragOverlay>

          </DndContext>




        </div>
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

