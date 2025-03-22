"use client"

import { getTitleLetters } from "@/components/media-card";
import SideBar from "@/components/sidebar";

import MediaDialog from "@/components/media-dialog";
import { Avatar, Box, Button, Flex, Select, TextField } from "@radix-ui/themes";
import DragView from "@/components/drag-view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { setDialog, setSearch, setSort } from "@/mediaSlice";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";





export default function Home({username} : {username: string}) {
  
  const sort = useSelector((state: RootState) => state.media.sort)
  const dialog = useSelector((state: RootState) => state.media.dialog)
  const dispatch: AppDispatch = useDispatch()



  return (
    // find alternative to overflow hidden
    <div className="flex flex-row h-dvh min-w-0 overflow-hidden">

      {
        dialog && <MediaDialog></MediaDialog>
      }

      <SideBar/>
      
      <div className="min-w-fit h-full flex flex-col flex-1">

        <Flex m={"2"} id="toolbar">
          <Flex id="utilities" align={"center"} justify={"center"} gap={"3"} flexGrow={"1"} className="mx-auto" >
            <Box maxWidth={"400px"} flexGrow={"1"} id="search">
              <TextField.Root
                placeholder="Search for media"
                onInput={(e) => { dispatch(setSearch((e.target as HTMLInputElement).value)) }}
                autoComplete="off"
                size={"2"}
                radius="large"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>

            <Flex maxWidth={"150px"} flexGrow={"1"} justify={"center"} id="sort">
              <Select.Root
                onValueChange={(value) => {
                  dispatch(setSort(value))
                }}
                defaultValue={sort}
                size={"2"}
                key={"sort"}
              >
                <Select.Trigger />

                <Select.Content
                  position="popper"
                >
                  <Select.Item value="alphabetical">
                    Alphabetical
                  </Select.Item>

                  <Select.Item value="highest_rating">
                    Highest Rating
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Button id="new" onClick={() => dispatch(setDialog({ type: "add", media: undefined } as DialogOptions))}>
              New Item
            </Button>
          </Flex>
          
          <Avatar fallback={getTitleLetters(username)} radius={"full"} />
        </Flex>
        
        

        <div className="flex flex-row flex-1 p-2 pb-2 overflow-x-hidden">
          <DragView></DragView>
        </div>

      </div>

    </div>
  );
}



export const COMPLETION_LEVELS = ['Pending', 'Ongoing', 'Finished', 'Dropped'] as const;
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

export type DialogOptions = {
  media: Media | undefined,
  type: "edit" | "add"
}