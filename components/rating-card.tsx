"use client";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


function ProgressCircle({rating} : {rating: number | undefined}) {
    const size = 60
    const radius = 25
    const dashArray = radius * 2 * Math.PI
    const strokeWidth = 8
    return (
        <svg width={size} height={size} className="flex flex-none">
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <circle r={radius} cx={size/2} cy={size/2} fill="transparent" stroke="lightgrey" strokeWidth={`${strokeWidth}px`} strokeDasharray={dashArray} strokeDashoffset="0"></circle>
                <circle className="progress" stroke="#75DDDD" strokeDashoffset={ rating ? dashArray * (1 - rating / 10) : dashArray} r={radius} cx={size / 2} cy={size / 2} fill="transparent" strokeLinecap="round" strokeWidth={`${strokeWidth}`} strokeDasharray={dashArray}>
                </circle>
                {/* style={{ transition: "all 1s ease-in-out" }} */}
            </g>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className={` font-sans ${rating ? "text-lg" : "text-base"} font-medium content-center`}>{rating || "N/A"}</text>
        </svg>
    )
}


export default function MediaCard( { title, rating }: { title: string, rating: number | undefined}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: title,
        data: { rating: rating }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return ( 
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} aria-describedby="" className="flex flex-row items-center border-2 rounded-xl px-3 py-2 select-none shadow-sm hover:shadow-md bg-white">
            <ProgressCircle rating={rating}></ProgressCircle>
            <span className=" ml-4 line-clamp-2">{title}</span>
        </div>
    )
}