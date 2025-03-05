"use client";
import { useDraggable } from '@dnd-kit/core';
import MediaDialog from './media-dialog';
import { Media } from '@/app/home';
import { Avatar, Progress } from '@radix-ui/themes';
import { memo } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Portal } from 'radix-ui';



function ProgressCircle({ rating }: { rating: number | null }) {
    const size = 60
    const radius = 25
    const dashArray = radius * 2 * Math.PI
    const strokeWidth = 8

    return (
        <svg width={size} height={size} className="flex flex-none">
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <circle r={radius} cx={size / 2} cy={size / 2} fill="transparent" stroke="lightgrey" strokeWidth={`${strokeWidth}px`} strokeDasharray={dashArray} strokeDashoffset="0"></circle>
                <circle className="progress" stroke="#75DDDD" strokeDashoffset={rating ? dashArray * (1 - rating / 10) : dashArray} r={radius} cx={size / 2} cy={size / 2} fill="transparent" strokeLinecap="round" strokeWidth={`${strokeWidth}`} strokeDasharray={dashArray} />
            </g>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className={` font-sans ${rating ? "text-lg" : "text-base"} font-medium content-center`}>{rating || "N/A"}</text>
        </svg>
    )
}



export const MediaCard = memo(function MediaCard({ media, onEdit = () => { }, onDelete = () => { } }: 
    { 
        media: Media,
        onEdit?: (newMedia: Media, originalMedia: Media | undefined) => any, onDelete?: (originalMedia: Media | undefined) => any
    }) {

    const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
        id: media.title,
        data: {
            title: media.title,
            rating: media.rating,
            completionLevel: media.completionLevel
        }
    });

    // const { title, extra, completionLevel, rating } = activeMedia!


    const style: React.CSSProperties = {
        opacity: isDragging ? "0.5" : "1",
        transform: CSS.Translate.toString(transform),
        position: isDragging ? 'fixed' : "relative",
    };

    const CardChildren = memo(() => {
        return (<>
            <div className='ml-4 flex flex-col flex-1'>
                <span className="line-clamp-2 text-start">{media.title}</span>
                <div className='flex items-center'>
                    <Progress value={progressValue} size="1" color={getColor} />
                    <span className=' ml-2 text-gray-500'>{media.rating ?? "N/A"}</span>

                </div>
            </div>
        </>)
    })


    const getColor = getProgressColor(media.rating ?? 0)
    const progressValue = (media.rating ?? 0) * 10
    const fallback = getTitleLetters(media.title)

    return (
        <>
        {/* Render in portal when dragging */}
        { isDragging ? 
                    <Portal.Root asChild>
                        <div
                            ref={setNodeRef}
                            style={style}
                            {...listeners}
                            {...attributes}
                            aria-describedby=''
                            className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                        >
                            <CardChildren/>
                        </div>
                    </Portal.Root>
        :
                    <div
                        ref={setNodeRef}
                        style={style}
                        {...listeners}
                        {...attributes}
                        aria-describedby=''
                        className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                    >
                        <CardChildren />
                    </div>
        }

        </>



    )
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

export function getTitleLetters(str: String) {
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
        let letters = str.match(/(\b[a-zA-Z])/gm);
        if (letters?.length == 2) return letters[0] + letters[1];
        return letters?.[0] ?? "";
    }
    return capitals;
}


// TODO: update
// export function StaticMediaCard({ title, rating }: { title: string, rating: number | null }) {


//     return (
//         <div
//             className='max-w-sm'
//         >
//             <div aria-describedby=''
//                 className="flex flex-row items-center border-2 rounded-xl px-3 py-2 select-none shadow-sm hover:shadow-md bg-white hover:cursor-grabbing">
//                 <StaticProgressCircle rating={rating} />
//                 <span className=" ml-4 line-clamp-2">{title}</span>
//             </div>
//         </div>
//     )
// }

function StaticProgressCircle({ rating }: { rating: number | null }) {
    const size = 60
    const radius = 25
    const dashArray = radius * 2 * Math.PI
    const strokeWidth = 8
    return (
        <svg width={size} height={size} className="flex flex-none">
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <circle r={radius} cx={size / 2} cy={size / 2} fill="transparent" stroke="lightgrey" strokeWidth={`${strokeWidth}px`} strokeDasharray={dashArray} strokeDashoffset="0"></circle>
                <circle stroke="#75DDDD" strokeDashoffset={rating ? dashArray * (1 - rating / 10) : dashArray} r={radius} cx={size / 2} cy={size / 2} fill="transparent" strokeLinecap="round" strokeWidth={`${strokeWidth}`} strokeDasharray={dashArray} />
            </g>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className={` font-sans ${rating ? "text-lg" : "text-base"} font-medium content-center`}>{rating || "N/A"}</text>
        </svg>
    )
}