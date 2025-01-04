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

  const [mediaList, setMediaList ] = useState(MEDIA_LISTS[0].media)

  const [search, setSearch ] = useState<string>("")
  const [sort, setSort] = useState<MediaSort>("highest_rating")

  const formatMedia = function formatMedia(completionLevel: string) {

    let formattedMedia: Media[] = mediaList.filter(media => media.completionLevel == completionLevel)
    
    if (search.trim().length != 0) {
      formattedMedia = formattedMedia.filter( media => media.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) 
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

  }

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




  const [activeMedia, setActiveMedia] = useState<Media | null>(null);  

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
        
        <Toolbar.Root id="toolbar" className="flex flex-none gap-2 justify-center py-4" >
          <div id="search" className="flex items-center border rounded-md px-2">
            <MagnifyingGlassIcon/>
            <input 
              type="text" id="search" className="mx-2 outline-none" autoComplete="off" 
              onInput={ (e) => {
                setSearch((e.target as HTMLInputElement).value)
              }}
            />
          </div>
          
          <Select.Root
            value={sort}
            onValueChange={ (value) => {
              setSort(value as MediaSort)
            }}
          >
            <Select.Trigger
              id="select"
              className="w-48 h-6 inline-flex flex-none items-center justify-center gap-[5px] rounded bg-white px-[15px] text-sm leading-none  shadow-black/10 outline-none focus:shadow-[0_0_0_2px]"
              aria-label="Food"
            >
              <Select.Icon>
                <CaretSortIcon />
              </Select.Icon>
              <Select.Value placeholder="Sort" className="line-clamp-1 text-nowrap"/>

            </Select.Trigger>
            <Select.Portal>
              <Select.Content 
                position="popper"
                className="overflow-hidden rounded-md bg-white "
                style={{width: "var(--radix-select-trigger-width)", maxHeight: "var(--radix-select-content-available-height)"}}
              >
                <Select.Viewport className="p-[5px]">
                  <Select.Item value="alphabetical" className="data-[state=checked]:hidden line-clamp-1 px-2 text-sm text-center">
                    <Select.ItemText>
                      Alphabetical
                    </Select.ItemText>
                  </Select.Item>

                  <Select.Item value="highest_rating" className="data-[state=checked]:hidden data-[state=checked]: line-clamp-1 px-2 text-sm text-center">
                    <Select.ItemText>
                      Highest Rating
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

        <div className="flex flex-row flex-1 p-2 pb-2 overflow-x-hidden">

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
              
              setMediaList( (prevState) => (prevState.map( (media) => media.title == activeMedia?.title ? {...activeMedia, completionLevel: newCompletionLevel} : media )))

              setActiveMedia({ title: title as string, rating, completionLevel: newCompletionLevel })

              CategoryInfo[newCompletionLevel].ref.current?.scrollToIndex(formatMedia(newCompletionLevel).indexOf(activeMedia!))

            }}
          >


            {

              COMPLETION_LEVELS.map(completionLevel =>
              ((filter == null || filter == completionLevel) &&

                <CompletionLevelColumn
                  VListRef={CategoryInfo[completionLevel].ref}
                  hover={activeMedia?.completionLevel == completionLevel}
                  onFilter={() => {
                    const newFilter: CompletionLevels | null = filter ? null : completionLevel as CompletionLevels

                    setFilter(newFilter as CompletionLevels)
                    return newFilter
                  }}
                  completionLevel={completionLevel} key={completionLevel} hoverColor={CategoryInfo[completionLevel].hoverColor
                  }>

                  {formatMedia(completionLevel).map((media) => 
                    <MediaCard 
                      media={media}
                      key={media.title}
                      onEdit={(updatedMedia) => {
                        setMediaList((oldList) => oldList.map((oldMedia) => oldMedia.title == media.title ? updatedMedia : oldMedia));
                      } } 
                      
                      onDelete={ () => {
                        setMediaList((oldList) => oldList.filter((oldMedia) => oldMedia.title != media.title))
                      } }                      />)
                  }

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

export type MediaSort =
  | 'alphabetical'
  | 'highest_rating'
  | 'lowest_rating'

export type Media = {
  title: string;
  rating: null | number;
  completionLevel: CompletionLevels;
}

interface MediaMap {
  [key: string]: {
    hoverColor: string,
    ref: RefObject<VListHandle | null>
  }
}

