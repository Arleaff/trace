import { useAddListMutation, useGetListsQuery } from "@/apiSlice";
import { AppDispatch, RootState } from "@/app/store";
import { setCurrentList } from "@/mediaSlice";
import { InputIcon, TrashIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-label";
import { AlertDialog, Button, Dialog, Flex, TextField } from "@radix-ui/themes";
import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

    const dispatch: AppDispatch = useDispatch()
    const searchParams = useSearchParams()

    const { data: lists } = useGetListsQuery()    


    useEffect(() => {

        const params = new URLSearchParams(searchParams.toString())

        const allLists = lists
        const list = params.get('list')
        

        if (list == null) {
            dispatch(setCurrentList(""))
            dispatch(setMedia([]))
        }
        else if (allLists && !allLists.includes(list)) {         
            window.history.replaceState({}, '', "/");
        }
        else if (allLists) {
            dispatch(setCurrentList(list))
        }
        
    }, [lists])



    return (
        <div className="flex-none flex flex-col border-r text-nowrap shadow-md" style={sidebarStyle}>

            <Image
                className="dark:invert hover:cursor-pointer box-border mx-4 my-2 self-end size-10" src="/menu.svg" alt="Menu" width={40} height={40}
                onClick={() => {
                    setOpen(!open)
                }}
            />



            <ul className="flex flex-col px-2 box-border gap-2" style={sideBarContentStyle}>
                <AddListDialog/>

                {
                    (lists ?? []).map((list: string) =>
                        <MediaList key={list} listName={list}></MediaList>
                    )
                }
            </ul>

        </div>
    );
}

function AddListDialog() {

    const [open, setOpen] = useState(false)
    const dispatch: AppDispatch = useDispatch()

    const searchParams = useSearchParams()
    const [addList, result] = useAddListMutation()


    return (

        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button>New List</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">

                <Dialog.Title>Add List</Dialog.Title>

                <form action={async formData => {
                    const newList = formData.get("name") as string;

                    addList(newList) // TODO: handle error/result
                    dispatch(setCurrentList(newList))
                    setOpen(false)

                    const params = new URLSearchParams(searchParams.toString())
                    params.set('list', newList)
                    window.history.pushState({}, '', `?${params.toString()}`);

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

const MediaList = memo(function MediaList ({ listName }: { listName: string }) {

    const currentList = useSelector((state: RootState) => state.media.currentList)
    const dispatch: AppDispatch = useDispatch()

    const searchParams = useSearchParams()

    const setList = useCallback(() => {
        dispatch(setCurrentList(listName))

        const params = new URLSearchParams(searchParams.toString())
        params.set('list', listName)

        window.history.pushState({}, '', `?${params.toString()}`);
    }, [dispatch, listName, searchParams])

    const deleteList = useCallback( () =>{
        localStorage.removeItem(currentList)

        const oldLists = JSON.parse(localStorage.getItem("lists") ?? "[]") as string[]
        localStorage.setItem("lists", JSON.stringify(oldLists.filter( list => list != listName)) )
        dispatch(setCurrentList(""))
        dispatch(setMedia([]))

        window.history.replaceState({}, '', "/");
        

    }, [currentList, dispatch, listName])

    const renameList = useCallback((newName: string) => {
        
        const mediaList = JSON.parse(localStorage.getItem(listName) ?? "[]")
        const listNames = JSON.parse(localStorage.getItem("lists") ?? "[]") as string[]

        if (!listNames.includes(newName) && newName.length != 0) {
            localStorage.removeItem(currentList)
            localStorage.setItem("lists", JSON.stringify([...listNames.filter(list => list != listName), newName]))
            localStorage.setItem(newName, JSON.stringify(mediaList))

            dispatch(setCurrentList(newName))

            const params = new URLSearchParams(searchParams.toString())
            params.set('list', newName)

            window.history.pushState({}, '', `?${params.toString()}`);
        }

    }, [currentList, dispatch, listName, searchParams])

    return (
        <>
            <Flex gap={"2"} className="hover:bg-gray-400 hover:bg-opacity-50 flex-1 cursor-pointer rounded-md border px-2" align={"center"}>
                <li onClick={setList} className=" flex-1" >{listName}</li>
                { currentList == listName && 
                    <>

                    <Dialog.Root>
                        <Dialog.Trigger>
                            <InputIcon width={20} height={20} color="gray" />
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="450px">

                            <Dialog.Title>Add List</Dialog.Title>

                            <form action={async (formData) => {
                                const newName = formData.get("name") as string;
                                renameList(newName);
                            }}>
                                <Label>
                                    New Name
                                    <TextField.Root id="name" name="name" autoComplete="off" defaultValue={listName} placeholder="Enter list name" />
                                </Label>

                                <Flex gap="3" mt="4" justify="between">
                                    <Dialog.Close>
                                        <Button variant="soft" color="gray">
                                            Cancel
                                        </Button>
                                    </Dialog.Close>

                                    <Button>Save</Button>

                                </Flex>
                            </form>

                        </Dialog.Content>
                    </Dialog.Root>

                    <AlertDialog.Root>
                        <AlertDialog.Trigger >
                            <TrashIcon width={20} height={20} color="red" />
                        </AlertDialog.Trigger>
                        <AlertDialog.Content maxWidth="450px">
                            <AlertDialog.Title>Delete list</AlertDialog.Title>
                            <AlertDialog.Description size="2" mb={"3"} >
                                Are you sure? <strong>This action cannot be undone.</strong>
                            </AlertDialog.Description>

                            <form action={async formData => {
                                const name = formData.get("name");
                                if (name == listName) {
                                    deleteList();
                                }
                            }}>
                                <Label>
                                    Confirm name of list to delete
                                    <TextField.Root id="name" name="name" autoComplete="off" placeholder="Enter list name" />
                                </Label>

                                <Flex gap="3" mt="4" justify="between">
                                    <AlertDialog.Cancel>
                                        <Button variant="soft" color="gray">
                                            Cancel
                                        </Button>
                                    </AlertDialog.Cancel>
                                    <Button variant="solid" color="red">
                                        Delete
                                    </Button>
                                </Flex>
                            </form>

                        </AlertDialog.Content>
                    </AlertDialog.Root>
                        
                    </>
                }
            </Flex>

        </>
    )
})

