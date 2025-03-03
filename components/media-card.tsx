"use client";
import { useDraggable } from '@dnd-kit/core';
import MediaDialog from './media-dialog';
import { Media } from '@/app/home';
import { Avatar, Progress } from '@radix-ui/themes';



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

export default function MediaCard({ media, onEdit = () => { }, onDelete = () => { } }: 
    { 
        media: Media,
        onEdit?: (arg0: Media) => any, onDelete?: () => any
    }) {

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: media.title,
    });

    const style: React.CSSProperties = {
        opacity: isDragging ? "0.5" : "1",
    };

    return (
        <>
            <MediaDialog 
                dialogTitle="Edit item"
                altText='Delete' 
                media={media}
                onConfirm={onEdit} 
                onAlt={onDelete}>

                <div
                    ref={setNodeRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                    aria-describedby=''
                    className="flex flex-row items-center border-2 rounded-xl pl-3 pr-1 py-2 select-none max-w-sm shadow-sm hover:shadow-md bg-white w-full my-1"
                >
                    <Avatar
                        size="4"
                        // src="https://cdn.prod.website-files.com/64479cbddbde2b42cebe552a/670e4c1fdec561d0419f4098_670e4be66e34c8126df5c591_670e4888efe72ee66f962fee_670e2e2c4421c5eb50a25db1_670e28900575f08fa68d13de_670e24b04b526202fa50647d_670e1c95221517c9ae85e314_Untitled%25252525252520design%25252525252520(17).jpeg"
                        fallback={getTitleLetters(media.title)}
                        className=''
                    />


                    {/* <img className='w-1/4 h-20 object-cover' src='https://cdn.prod.website-files.com/64479cbddbde2b42cebe552a/670e4c1fdec561d0419f4098_670e4be66e34c8126df5c591_670e4888efe72ee66f962fee_670e2e2c4421c5eb50a25db1_670e28900575f08fa68d13de_670e24b04b526202fa50647d_670e1c95221517c9ae85e314_Untitled%25252525252520design%25252525252520(17).jpeg' /> */}

                    <div className='ml-4 flex flex-col flex-1'>
                        <span className="line-clamp-2 text-start">{media.title}</span>
                        <div className='flex items-center'>
                            <Progress value={(media.rating ?? 0) * 10} size="1" color={getProgressColor(media.rating ?? 0)} />
                            <span className=' ml-2 text-gray-500'>{media.rating ?? "N/A"}</span>
                            
                        </div>
                        
                        {/* <ProgressCircle rating={media.rating}></ProgressCircle> */}
                    </div>

                    

                </div>
            </MediaDialog>
        </>



    )
}

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