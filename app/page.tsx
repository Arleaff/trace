"use client"

import CategoryColumn from "@/components/column";
import MediaCard, { StaticMediaCard } from "@/components/rating-card";
import {  DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core";
import { DropAnimationSideEffects, KeyframeResolver } from "@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation";
import { CSS } from '@dnd-kit/utilities';

import { useState } from "react";

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


  const [activeMedia, setActiveMedia] = useState<{title: string, rating: number | undefined} | null>(null);

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

    console.log(className?.active);
    
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


  return (
    <div className="flex flex-row h-dvh p-8 overflow-hidden">

      <DndContext
        autoScroll={false}
        measuring={measuringConfig}
        onDragStart={
          (event) => {
            console.log(event);
            
            const { rating } = (event.active.data.current as { rating: number | undefined })
            const title = event.active.id
            setActiveMedia({ title: title as string, rating: rating } )
          }
        }
        onDragEnd={
          (event) => {            
            setActiveMedia(null)
            const { category, rating } = (event.active.data.current as { category: string, rating: number | undefined})
            const title = event.active.id
            
            const newCategory = event.over?.id as string

            if (category == newCategory) {
              return
            }

            const { media: oldMedia, setMedia: setOldMedia} = categories[category]
            const { media: newMedia, setMedia: setNewMedia } = categories[newCategory]

            setOldMedia(oldMedia.filter(media => media.title != title))
            // consider small delay here as opposed to animation
            setTimeout( () => {
              setNewMedia([...newMedia, { title: title, rating: rating }])

            }, 150)

          }
        }
        >

          
        {
          
          Object.keys(categories).map(category =>
          (filter == CategoryFilter.All || filter == (CategoryFilter as any)[category]) &&
            <CategoryColumn
              onFilter={ () => {
                  const newFilter: CategoryFilter = filter == CategoryFilter.All ? (CategoryFilter as any)[category] : CategoryFilter.All
                  setFilter(newFilter)
                  return newFilter
              }}
              categoryName={category} key={category} hoverColor={ categories[category].hoverColor 
            }>
              {categories[category].media.sort((a, b) => a.title.localeCompare(b.title)).map((media) => <MediaCard category={category} title={media.title} rating={media.rating} key={media.title} ></MediaCard>)}
            </CategoryColumn>
          )
        }
        <DragOverlay 
          dropAnimation={{ duration: 500, easing: "ease-in-out",
            keyframes: defaultKeyframeResolver,
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: ".5"
                },
              },
              className: {
                active: "card"
              }
            }),
          }}
        >
          {activeMedia &&<StaticMediaCard category={""} title={activeMedia.title} rating={activeMedia.rating} ></StaticMediaCard>}
        </DragOverlay>


      </DndContext>


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

