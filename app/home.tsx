"use client"

import { getTitleLetters, MediaCard } from "@/components/media-card";
import SideBar from "@/components/sidebar";
import { MEDIA_LISTS } from "@/data";
import { CaretSortIcon, MagnifyingGlassIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as Select from "@radix-ui/react-select";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { VListHandle } from "virtua";
import MediaDialog from "@/components/media-dialog";
import { getUserLists } from "@/db";
import { Avatar } from "@radix-ui/themes";
import DragView from "@/components/drag-view";



export default function Home({username} : {username: string}) {

  // const [ userLists, setUserLists ] = useState(getUserLists("raf"))
  
  const [mediaList, setMediaList ] = useState(MEDIA_LISTS[0].media)

  const [search, setSearch ] = useState<string>("")
  const [sort, setSort] = useState<MediaSort>("highest_rating")

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

  }



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


  return (
    // find alternative to overflow hidden
    <div className="flex flex-row h-dvh min-w-0 overflow-hidden">
      <SideBar>

      </SideBar>
      
      <div className="min-w-fit h-full flex flex-col flex-1">
        
        <Toolbar.Root id="toolbar" className="flex flex-none gap-2 justify-center py-4 h-fit" >
          <div id="search" className="flex items-center border rounded-md px-2">
            <MagnifyingGlassIcon/>
            <input 
              type="text" id="search" className="mx-2 outline-none h-6" autoComplete="off" 
              onInput={ (e) => {
                setSearch((e.target as HTMLInputElement).value)
              }}
            />
          </div>
          
          <Select.Root
            value={sort} // can be commented out
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

            <MediaDialog 
                dialogTitle="Create new item"
                altText='Cancel' 
                onConfirm={ media => { setMediaList( list => [...list, media] ) }} 
              >

              <Toolbar.Button className="inline-flex items-center gap-1">
                New Item
              </Toolbar.Button>
            </MediaDialog>

          <Avatar fallback={getTitleLetters(username)} radius={"full"} className=" fixed top-0 right-0 m-2" />


        </Toolbar.Root>

        <div className="flex flex-row flex-1 p-2 pb-2 overflow-x-hidden">
          <DragView search={search} sort={sort}></DragView>
        </div>
      </div>

    </div>
  );
}



export const COMPLETION_LEVELS = ['Unstarted', 'Ongoing', 'Finished', 'Dropped'] as const;
export type CompletionLevel = typeof COMPLETION_LEVELS[number];

export type MediaSort =
  | 'alphabetical'
  | 'highest_rating'
  | 'lowest_rating'

export type Media = {
  title: string;
  rating: number | null;
  completionLevel: CompletionLevel;
}



