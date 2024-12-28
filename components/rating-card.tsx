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
                {/* style={{ transition: "all 1s ease-in-out" }} */}
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

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? "height ease-in-out .5s" : "all ease-in-out .5s",
        height: isDragging ? "0" : node.current?.clientHeight,
        marginBottom: isDragging ? "0" : ".75rem",

    }

    const style2: React.CSSProperties = {
        position: isDragging ? "absolute" : undefined,
        width: isDragging ? node.current?.parentElement?.clientWidth : undefined,



    }

    return ( 
        <div 
            style={style} 
            className='card'
        >
            <div ref={setNodeRef} {...listeners} {...attributes} style={style2} aria-describedby='' className="flex flex-row items-center border-2 rounded-xl px-3 py-2 select-none shadow-sm hover:shadow-md bg-white">
                <ProgressCircle rating={rating}></ProgressCircle>
                <span className=" ml-4 line-clamp-2">{title}</span>
            </div>
        </div>
        
        
    )
}