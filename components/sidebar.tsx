import { AppDispatch, RootState } from "@/app/store";
import { initializeMedia, setCurrentList } from "@/mediaSlice";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


function AddListDialog() {
    
    const [open, setOpen] = useState(false)
    const dispatch: AppDispatch = useDispatch()


    return (
    
    <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
            <Button>New List</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">

            <Dialog.Title>Add List</Dialog.Title>

            <form action={ async formData => {                                
                const newList = formData.get("name") as string;
                const lists = JSON.parse(localStorage.getItem("lists") ?? "[]");
                if (lists?.includes(newList)) {
                    console.log("error");
                }
                else {
                    localStorage.setItem("lists", JSON.stringify([...lists, newList]))
                    dispatch(setCurrentList(newList))
                    setOpen(false)

                }
                
            }}>
                <Flex direction="column" gap="3">
                    <label htmlFor="name">
                        <div className="mb-2 font-bold">
                            List Name
                        </div>
                        
                    </label>
                    <TextField.Root id="name" name="name" defaultValue="Movies" placeholder="Enter list name" />
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button>Add</Button>

                </Flex>
            </form>
            
        </Dialog.Content>
    </Dialog.Root>);
}


export default function SideBar() {

    const [open, setOpen] = useState(false);

    const sideBarContentStyle: React.CSSProperties = {
        opacity: open ? "1" : 0,
        overflow: "hidden",

        width: open ? "250px" : "0px",
        transition: "width ease-in-out .5s",

    }

    const sidebarStyle: React.CSSProperties = {
        width: open ? "250px" : "72px",
        transition: "width ease-in-out .5s",
    }

    const [lists, setLists] = useState([]);

    const dispatch: AppDispatch = useDispatch()
    const searchParams = useSearchParams()

    useEffect( () => {
        // get lists from local storage
        setLists(JSON.parse(localStorage.getItem("lists") ?? "[]")) 
    }, [])

    useEffect(() => {

        const params = new URLSearchParams(searchParams.toString())

        let list = params.get('list')
        

        if (list == null) {
            dispatch(setCurrentList(""))
            dispatch(initializeMedia([]))
        }
        else {
            dispatch(setCurrentList(list))
            dispatch(initializeMedia(JSON.parse(localStorage.getItem(list) ?? "[]")))
        }
        
    }, [searchParams])



    return (
        <div className="flex-none flex flex-col border-r text-nowrap shadow-md" style={sidebarStyle}>

            <Image
                className="dark:invert hover:cursor-pointer box-border mx-4 my-2 self-end size-10" src="/menu.svg" alt="Menu" width={40} height={40}
                onClick={() => {
                    setOpen(!open)
                }}
            />



            <ul className="flex flex-col px-2 box-border gap-2" style={sideBarContentStyle}>
                <AddListDialog></AddListDialog>

                {
                    lists.map((list: string) =>
                        <MediaList key={list} listName={list}></MediaList>
                    )
                }
            </ul>

        </div>
    );
}

const MediaList = memo(function ({ listName }: { listName: string }) {

    const dispatch: AppDispatch = useDispatch()

    const searchParams = useSearchParams()


    const setList = useCallback(() => {
        dispatch(setCurrentList(listName))

        dispatch(initializeMedia(JSON.parse(localStorage.getItem(listName) ?? "[]")))

        const params = new URLSearchParams(searchParams.toString())
        params.set('list', listName)

         // TODO: catch error if list does not exist
        //TODO: dynamic route and handle stack pop MAYBE
        window.history.pushState({}, '', `?${params.toString()}`);
    },
        [])

    return (
        <li onClick={setList} className="hover:bg-gray-400 hover:bg-opacity-50 cursor-pointer rounded-md border px-2">{listName}</li>
    )
})