"use client"

import CategoryColumn from "@/components/column";
import MediaCard, { StaticMediaCard } from "@/components/rating-card";
import {  closestCenter, DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DropAnimationSideEffects, KeyframeResolver } from "@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import Image from "next/image"

import { useEffect, useState } from "react";

export default function Home() {
  
  const [filter, setFilter] = useState(CategoryFilter.All)

  const [unstarted, setUnstarted] = useState([
    { title: "Bleach", rating: undefined },
    { title: "HxH", rating: undefined }
  ])

  const [ongoing, setOngoing] = useState([
    { title: "Naruto", rating: 8.5 },
    { title: "Re:Zero", rating: 9.5 },
    { title: "That Time I Got Reincarnated as a Slime", rating: 8 }
  ])

  const [finished, setFinished] = useState([
    { title: "Attack on Titan", rating: 10 },
    { title: "Cyberpunk Edgerunners", rating: 10 },
    { title: "Vinland Sage", rating: 10 },
    { title: "One Punch Man", rating: 7 },
    { title: "JJK", rating: 8.5 },
    { title: "Dandadan", rating: 8.5 },
    { title: "Kaiju No. 8", rating: 8.5 },
    { title: "Chainsaw Man", rating: 9 },
    { title: "Frieren", rating: 7.5 },
  ])

  const [dropped, setDropped] = useState([
    { title: "Tower of God", rating: 7 },
    { title: "Made in Abyss", rating: 8 }
  ])


  const categories: CategoryMap = {
      "Unstarted": {  
      hoverColor: "rgb(128 128 128 / .1)",
      media: unstarted,
      setMedia: setUnstarted
    }, 
      "Ongoing": {
      hoverColor: "rgb(82 204 207 / .2)",
      media: ongoing,
      setMedia: setOngoing
    },
      "Finished": {
      
      hoverColor: "rgb( 64 201 103 / .15)",
      media: finished,
      setMedia: setFinished
    },
      "Dropped": {
      hoverColor: "rgb(243 16 141 / .1)",
      media: dropped,
      setMedia: setDropped
    },
  }

  


  const [activeMedia, setActiveMedia] = useState<{title: string, rating: number | undefined, category: string} | null>(null);

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    }
  };

  const defaultKeyframeResolver: KeyframeResolver = ({
    transform: { initial, final },
    
  }) => { 
    return [
      {
        transform: CSS.Transform.toString(initial),
      },
      {
        transform: (CSS.Transform).toString(final),
      },
    ]
  };

  const defaultDropAnimationSideEffects = (
    options: { styles: any; className: any; }
  ): DropAnimationSideEffects => ({ active, dragOverlay }) => {
    const originalStyles: Record<string, string> = {};
    const { styles, className } = options;

    if (styles?.active) {
      for (const [key, value] of Object.entries(styles.active)) {
        if (value === undefined) {
          continue;
        }

        originalStyles[key] = active.node.style.getPropertyValue(key);
        active.node.style.setProperty(key, value as string);
      }
    }

    if (styles?.dragOverlay) {
      for (const [key, value] of Object.entries(styles.dragOverlay)) {
        if (value === undefined) {
          continue;
        }

        dragOverlay.node.style.setProperty(key, value as string);
      }
    }
    
    if (className?.active) {
      active.node.classList.add(className.active);
    }

    if (className?.dragOverlay) {
      dragOverlay.node.classList.add(className.dragOverlay);
    }

    return function cleanup() {
      for (const [key, value] of Object.entries(originalStyles)) {
        active.node.style.setProperty(key, value);
      }

      if (className?.active) {
        active.node.classList.remove(className.active);
      }
    };
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const circleProgress = document.querySelectorAll(".progress");

    const progressAnimation: Keyframe[] = [
      { strokeDashoffset: "157.07963267948966" },
      { strokeDashoffset: "" },
    ];

    const progressTiming: KeyframeAnimationOptions = {
      duration: 500,
      iterations: 1,
      easing: "ease-in-out",
      delay: 0
    };

    circleProgress.forEach ( (node) => {
      node.animate(progressAnimation, progressTiming)
    })

  }, [])


  return (

    <div className="flex flex-row h-dvh">
      <div className="flex-none">
        <Image
          className="dark:invert hover:cursor-pointer"
          src="/menu.svg"
          alt="Menu"
          width={40}
          height={40}
        />
      </div>
      <div className="flex flex-1 flex-row h-dvh p-4 min-w-0 overflow-hidden">

        <DndContext
          sensors={sensors}
          // measuring={measuringConfig}
          collisionDetection={closestCenter}
          onDragStart={
            (event) => {
              
              const { rating, category } = (event.active.data.current as { rating: number | undefined, category: string })
              const title = event.active.id
              setActiveMedia({ title: title as string, rating, category } )
            }
          }
          onDragEnd={
            (event) => {
              setActiveMedia(null)
            }
          }
          onDragOver={ (event) => {
            const { category, rating } = (event.active.data.current as { category: string, rating: number | undefined })
            const title = event.active.id          

            const newCategory = (event.over?.data.current?.category || event.over?.id) as string       

            if (category == newCategory || !newCategory) {
              return
            }          

            const { media: oldMedia, setMedia: setOldMedia } = categories[category]
            const { media: newMedia, setMedia: setNewMedia } = categories[newCategory]

            setActiveMedia({ title: title as string, rating, category: newCategory })

            setOldMedia(oldMedia.filter(media => media.title != title))
            setNewMedia([...newMedia, { title, rating, category }])
          }}
          >

            
          {
            
            Object.keys(categories).map(category =>
            (filter == CategoryFilter.All || filter == (CategoryFilter as any)[category]) &&

         
                
                <CategoryColumn
                  hover={activeMedia?.category == category}
                  onFilter={() => {
                    const newFilter: CategoryFilter = filter == CategoryFilter.All ? (CategoryFilter as any)[category] : CategoryFilter.All
                    setFilter(newFilter)
                    return newFilter
                  }}
                  categoryName={category} key={category} hoverColor={categories[category].hoverColor
                  }>
                    <SortableContext
                      key={category}
                      id={category}
                      items={categories[category].media.sort((a, b) => a.title.localeCompare(b.title)).map((item) => item.title)}
                      strategy={verticalListSortingStrategy}

                    >    
                    {categories[category].media.sort((a, b) => a.title.localeCompare(b.title)).map((media) => <MediaCard category={category} title={media.title} rating={media.rating} key={media.title} ></MediaCard>)}
                    </SortableContext>

                  </CategoryColumn>


                
            )
          }
          <DragOverlay>
            {activeMedia && <StaticMediaCard category={""} title={activeMedia.title} rating={activeMedia.rating} ></StaticMediaCard>}
          </DragOverlay>

        </DndContext>


      </div>
    </div>
  );
}

export enum CategoryFilter {
  Unstarted,
  Ongoing,
  Finished,
  Dropped,
  All
}

interface CategoryMap {
  [key: string]: {
    hoverColor: string,
    media: {
      title: string;
      rating: number | undefined;
    }[],
    setMedia: any
  }
}

