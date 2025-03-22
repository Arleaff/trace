"use client";
import { useDraggable } from '@dnd-kit/core';
import { DialogOptions, Media } from '@/app/home';
import { Progress, Theme } from '@radix-ui/themes';
import { memo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Portal, Avatar } from 'radix-ui';
import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';
import { setDialog } from '@/mediaSlice';




export const MediaCard = memo(function MediaCard({ media }: 
    { 
        media: Media,
    }) {

    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: media.title,
        data: {
            title: media.title,
            rating: media.rating,
            completionLevel: media.completionLevel
        }
    });

    const dispatch: AppDispatch = useDispatch()

    const style: React.CSSProperties = {
        opacity: isDragging ? "0.5" : "1",
        transform: CSS.Translate.toString(transform),
        position: isDragging ? 'fixed' : "relative",
    };


    const getColor = getProgressColor(media.rating ?? 0)
    const progressValue = (media.rating ?? 0) * 10
    const fallback = getTitleLetters(media.title)


    return (
        <>
        {/* Render in portal when dragging */}
        { isDragging ? 
                <Theme asChild>

                    <Portal.Root asChild>
                        <div
                            ref={setNodeRef}
                            style={style}
                            {...listeners}
                            {...attributes}
                            aria-describedby=''
                            className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                        >
                        <CardChildren fallback={fallback} media={media} progressValue={progressValue} getColor={getColor} />

                        </div>
                    </Portal.Root>
                </Theme>

        :

            <div
                ref={setNodeRef}
                style={style}
                    {...listeners}
                    {...attributes}
                aria-describedby=''
                className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                onClick={ () => {
                    dispatch(setDialog({type: "edit", media} as DialogOptions))
                }}
            >
            <CardChildren fallback={fallback} media={media} progressValue={progressValue} getColor={getColor} />
            </div>
        }

        </>



    )
})

const CardChildren = memo(function CardChildren ({ fallback, media, progressValue, getColor }: {
    fallback: string, media: Media, progressValue: number, getColor: "ruby" | "amber" | "iris" | "jade"
}) {
    return (<> 
            <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-lg  align-middle">
                <Avatar.Fallback className="leading-1 flex size-full items-center justify-center text-[15px] font-medium bg-[#0058FF20] text-[#002AB3C9]">
                    {fallback}
                </Avatar.Fallback>
            </Avatar.Root>

            <div className='ml-4 flex flex-col flex-1'>
                <span className="line-clamp-2 text-start">{media.title}</span>
                <div className='flex items-center'>
                    <Progress value={progressValue} size="1" color={getColor} />
                    <span className=' ml-2 text-gray-500'>{media.rating ?? "N/A"}</span>

                </div>
            </div>        
    </>)
})


function getProgressColor(rating: number) {
    if (rating < 4) {
        return 'ruby';
    }
    if (rating < 8) {
        return "amber";
    }
    if (rating == 10) {
        return "iris"
    }
    return 'jade';
}

export function getTitleLetters(str: string) {
    let capitals = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i].toUpperCase() && str[i].match(/[A-Z]/)) {
            capitals += str[i];
            if (capitals.length === 2) {
                break;
            }
        }
    }

    if (capitals.length == 0) {
        const letters = str.match(/(\b[a-zA-Z])/gm);
        if (letters?.length == 2) return letters[0] + letters[1];
        return letters?.[0] ?? "";
    }
    return capitals;
}