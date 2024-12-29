"use client";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { RefObject, useRef } from 'react';




function ProgressCircle({rating} : {rating: number | undefined}) {
    const size = 60
    const radius = 25
    const dashArray = radius * 2 * Math.PI
    const strokeWidth = 8
    return (
        <svg width={size} height={size} className="flex flex-none">
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <circle r={radius} cx={size/2} cy={size/2} fill="transparent" stroke="lightgrey" strokeWidth={`${strokeWidth}px`} strokeDasharray={dashArray} strokeDashoffset="0"></circle>
                <circle className="progress" stroke="#75DDDD" strokeDashoffset={ rating ? dashArray * (1 - rating / 10) : dashArray} r={radius} cx={size / 2} cy={size / 2} fill="transparent" strokeLinecap="round" strokeWidth={`${strokeWidth}`} strokeDasharray={dashArray}/>
            </g>
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className={` font-sans ${rating ? "text-lg" : "text-base"} font-medium content-center`}>{rating || "N/A"}</text>
        </svg>
    )
}


export default function MediaCard( { title, rating, category }: { title: string, rating: number | undefined, category: string}) {
    const { attributes, listeners, setNodeRef, transform, isDragging, node } = useDraggable({
        id: title,
        data: { rating: rating, category: category }
    });

    return ( 
        <div 
        >
            <div 
                ref={setNodeRef}
                style={ isDragging ? {opacity: 0.5} : undefined}

                {...listeners} {...attributes} aria-describedby='' 
                className=" flex flex-1 flex-row items-center border-2 rounded-xl px-3 max-w-sm py-2 select-none shadow-sm hover:shadow-md bg-white">
                <ProgressCircle rating={rating}></ProgressCircle>
                <span className=" ml-4 line-clamp-2">{title}</span>
            </div>

            <div >

            </div>
        </div>
        
        
    )
}

export function StaticMediaCard({ title, rating, category }: { title: string, rating: number | undefined, category: string }) {


    return (
        <div

            // className='card' // doesn't work with delay
            className='max-w-sm'
        >
            <div aria-describedby=''
                className="flex flex-row items-center border-2 rounded-xl px-3 py-2 select-none shadow-sm hover:shadow-md bg-white">
                <StaticProgressCircle rating={rating}/>
                <span className=" ml-4 line-clamp-2">{title}</span>
            </div>
        </div>
    )
}

function StaticProgressCircle({ rating }: { rating: number | undefined }) {
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