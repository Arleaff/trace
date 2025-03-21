import { COMPLETION_LEVELS, CompletionLevel, Media } from "@/app/home";
import * as Select from "@radix-ui/react-select";
import { Label } from "@radix-ui/react-label";

import { Cross2Icon } from '@radix-ui/react-icons';
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { addMedia, deleteMedia, replaceMedia, setDialog } from "@/mediaSlice";
import { Button, Dialog } from "@radix-ui/themes";

export default function MediaDialog() {

    const dialog = useSelector((state: RootState) => state.media.dialog)
    const dispatch: AppDispatch = useDispatch()


    const [completionLevel, setCompletionLevel] = useState(dialog?.media?.completionLevel)

    const formRef = useRef<HTMLFormElement>(null)

    const title = dialog?.type == "add" ? "Add New Media" : "Edit Media"
    const altText = dialog?.type == "add" ? "Cancel" : "Delete"
    const confirmText = dialog?.type == "add" ? "Add" : "Confirm"

    const onClickAlt = useCallback(() => {
        if (dialog?.type == "edit") {
            dispatch(deleteMedia(dialog?.media))
        }
    }, [])

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
                                const rating = formData.get("rating");

                                dialog?.type == "add" ? dispatch(addMedia({ title, rating, completionLevel } as Media)) : dispatch(replaceMedia([dialog?.media, { title, rating, completionLevel } as Media]))

                                dispatch(setDialog(null))
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



                            <Label>
                                Category
                                <Select.Root
                                    onValueChange={(value) => {
                                        setCompletionLevel(value as CompletionLevel)
                                    }}
                                    defaultValue={dialog?.media?.completionLevel as string}
                                >
                                    <Select.Trigger
                                        id="select"
                                        className="m-4 w-48 h-6 inline-flex flex-none items-center justify-center gap-[5px] rounded bg-white px-[15px] text-sm leading-none  shadow-black/10 outline-none focus:shadow-[0_0_0_2px]"
                                        aria-label="Food"
                                        name="category"
                                    >
                                        <Select.Value placeholder="Choose a category" className="line-clamp-1 text-nowrap"/>

                                    </Select.Trigger>
                                    <Select.Portal>
                                        <Select.Content
                                            position="popper"
                                            className="overflow-hidden rounded-md bg-white "
                                            style={{ width: "var(--radix-select-trigger-width)", maxHeight: "var(--radix-select-content-available-height)" }}
                                        >

                                            <Select.Viewport className="p-[5px]">

                                                {
                                                    COMPLETION_LEVELS.map((level) =>
                                                        <Select.Item key={level} value={ level } className="data-[state=checked]:hidden line-clamp-1 px-2 text-sm text-center">
                                                            <Select.ItemText>
                                                                {level}
                                                            </Select.ItemText>
                                                        </Select.Item>
                                                    )
                                                }

                                            </Select.Viewport>

                                        </Select.Content>
                                    </Select.Portal>
                                </Select.Root>
                            </Label>

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
