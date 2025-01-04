import { media } from "@/app/page";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from "react";

export default function MediaDialog({ children, dialogTitle, description = undefined, confirmText = "Confirm", altText = "Cancel", mediaTitle = "", onConfirm, onAlt = () =>{} } 
    : { children?: React.ReactNode, dialogTitle: string, description?: string, confirmText?: string, altText?: string, mediaTitle?: string, 
        onConfirm: (arg0: media) => any , onAlt: (arg0: media) => any }
    ) {

    const [ open, setOpen ] = useState(false)

    return (
        <>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    {children}
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed size-full inset-0 bg-gray-500 opacity-50" />
                    <Dialog.Content className=" fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">

                        <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">{dialogTitle}</Dialog.Title>
                        { description && <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal">
                            {description}
                        </Dialog.Description>}
                        <form onSubmit={e => {
                            console.log(e);
                            setOpen(false)
                            e.preventDefault()
                        }}>
                            <label className="w-[90px] text-right text-[15px]" htmlFor="title">Title</label>
                            <input 
                                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" 
                                id="title"
                                defaultValue={mediaTitle}
                            />

                            <label className="w-[90px] text-right text-[15px] text-violet11" htmlFor="rating">Rating</label>
                            <input 
                                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]" 
                                id="rating" 
                                placeholder="N/A"
                            />

                            <div id="buttons" className="mt-[25px] flex justify-between">
                                <Dialog.Close asChild>
                                    <button type='submit' className="inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none">
                                        {altText}
                                    </button>
                                </Dialog.Close>

                                <button type='submit' className="inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 focus:outline-none">
                                    {confirmText}
                                </button>
                            </div>

                        </form>
                        <Dialog.Close asChild>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px focus:outline-none"
                                aria-label="Close"
                            >
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>


                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
