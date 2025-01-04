"use client";
import { useDraggable } from '@dnd-kit/core';
import MediaDialog from './media-dialog';
import { media } from '@/app/page';



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

export default function MediaCard({ title, rating, completionLevel }: { title: string, rating: number | null, completionLevel: string }) {

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: title,
        data: { rating: rating, completionLevel },
    });

    const style: React.CSSProperties = {
        opacity: isDragging ? "0.5" : "1",
    };

    return (
        <>
            <MediaDialog 
                dialogTitle="Edit item"
                description="Make changes to your item here. Click confirm when you're done."
                altText='Delete' 
                
                onConfirm={function (arg0: media) {
                    throw new Error('Function not implemented.');
                } } onAlt={function (arg0: media) {
                    throw new Error('Function not implemented.');
                } }            >
                <div
                    ref={setNodeRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                    aria-describedby=''
                    className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                >

                    <ProgressCircle rating={rating}></ProgressCircle>

                    <span className="ml-4 line-clamp-2 text-start">{title}</span>


                </div>
            </MediaDialog>
        </>



    )
}

// TODO: update
export function StaticMediaCard({ title, rating }: { title: string, rating: number | null }) {


    return (
        <div
            className='max-w-sm'
        >
            <div aria-describedby=''
                className="flex flex-row items-center border-2 rounded-xl px-3 py-2 select-none shadow-sm hover:shadow-md bg-white hover:cursor-grabbing">
                <StaticProgressCircle rating={rating} />
                <span className=" ml-4 line-clamp-2">{title}</span>
            </div>
        </div>
    )
}

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