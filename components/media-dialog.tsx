import { COMPLETION_LEVELS, CompletionLevel, Media } from "@/app/home";
import { Label } from "@radix-ui/react-label";

import { Cross2Icon } from '@radix-ui/react-icons';
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { setDialog } from "@/mediaSlice";
import { Box, Button, Dialog, Flex, Select } from "@radix-ui/themes";
import { useAddMediaMutation, useDeleteMediaMutation, useEditMediaMutation } from "@/apiSlice";

export default function MediaDialog() {

    const dialog = useSelector((state: RootState) => state.media.dialog)
    
    const dispatch: AppDispatch = useDispatch()
    
    const [addMedia, addResult] = useAddMediaMutation()

    const [editMedia, editResult] = useEditMediaMutation()

    const [deleteMedia, deleteResult] = useDeleteMediaMutation()

    const currentList = useSelector((state: RootState) => state.media.currentList)



    const [completionLevel, setCompletionLevel] = useState(dialog?.media?.completionLevel as string ?? "Pending")

    const formRef = useRef<HTMLFormElement>(null)

    const title = dialog?.type == "add" ? "Add New Media" : "Edit Media"
    const altText = dialog?.type == "add" ? "Cancel" : "Delete"
    const confirmText = dialog?.type == "add" ? "Add" : "Confirm"

    const onClickAlt = useCallback(() => {
        if (dialog?.type == "edit") {
            deleteMedia({ list: currentList, media: dialog.media! })
            dispatch(setDialog(null))
            
        }
    }, [dialog?.media, dialog?.type, dispatch])

    return (
        <>
            <Dialog.Root open={dialog != null} onOpenChange={() => dispatch(setDialog(null))}>
                    <Dialog.Content>

                        <Dialog.Title >{title}</Dialog.Title>

                        <form
                            ref={formRef}
                            onKeyDown={ (event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault()
                                        formRef.current?.requestSubmit()
                                    }
                                }
                            }
                            action={async formData => {                                
                                const title = formData.get("title");
                                if (!title) {
                                    alert("Title is required")
                                    return
                                }
                                const rating = Number(formData.get("rating"));

                                if (isNaN(rating) || rating < 0 || rating > 10) {
                                    alert("Rating must be a number between 0 and 10")
                                    return
                                }

                                if (dialog?.type == "add") {
                                    addMedia({ list: currentList, media: { title, rating, completionLevel } as Media})
                                    dispatch(setDialog(null))
                                }
                                else {
                                    editMedia({ old: dialog!.media!, new: { title, rating, completionLevel } as Media, list: currentList })
                                    dispatch(setDialog(null))
                                }

                            }}
                        >
                            <label className="w-[90px] text-right text-[15px]" htmlFor="title">Title</label>
                            <input 
                                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" 
                                id="title"
                                name="title"
                                autoComplete="off"
                                defaultValue={dialog?.media?.title}
                            />

                            <label className="w-[90px] text-right text-[15px] text-violet11" htmlFor="rating">Rating</label>
                            <input 
                                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" 
                                id="rating" 
                                name="rating"
                                autoComplete="off"
                                defaultValue={dialog?.media?.rating || undefined}
                                placeholder="N/A"
                            />

                            <Box className="pt-3">
                                <Flex align={"center"} gap={"2"}>
                                    <Label>Category</Label>

                                    <Select.Root
                                        onValueChange={(value) => {
                                            setCompletionLevel(value as CompletionLevel)
                                        }}
                                        value={completionLevel as string}
                                    >
                                        <Select.Trigger />

                                        <Select.Content position="item-aligned">
                                            {
                                                COMPLETION_LEVELS.map((level) =>
                                                    <Select.Item key={level} value={level}>
                                                        {level}
                                                    </Select.Item>
                                                )
                                            }

                                        </Select.Content>
                                    </Select.Root>
                            </Flex>
                                
                            </Box>
                            

                            <div id="buttons" className="mt-[25px] flex justify-between">
                                <Dialog.Close>
                                    <Button className="radix-themes" onClick={onClickAlt} color={ dialog?.type == "edit" ? "ruby" : "gray"}>
                                        {altText}
                                    </Button>
                                </Dialog.Close>

                                <Button>
                                    {confirmText}
                                </Button>
                            </div>
                            
                        </form>

                        
                        <Dialog.Close>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px focus:outline-none"
                                aria-label="Close"
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>


                    </Dialog.Content>
            </Dialog.Root>
        </>
    );
}
