"use client"

import CategoryColumn from "@/components/column";
import MediaCard from "@/components/rating-card";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";


export default function Home() {

  const [unstarted, setUnstarted] = useState([
    { title: "Bleach", rating: undefined },
    { title: "HxH", rating: undefined }
  ])

  const [ongoing, setOngoing] = useState([
    { title: "Naruto", rating: 8.5 },
    { title: "That Time I Got Reincarnated as a Slime", rating: 8 }
  ])

  const [finished, setFinished] = useState([
    { title: "Attack on Titan", rating: 10 },
    { title: "Cyberpunk Edgerunners", rating: 10 },
    { title: "Frieren", rating: 7.5 },
  ])

  const [dropped, setDropped] = useState([
    { title: "Tower of God", rating: 7 }
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



  return (
    <div className="flex flex-row h-dvh p-8 overflow-hidden">

      <DndContext

        onDragEnd={
          (event) => {
            const { category, rating } = (event.active.data.current as { category: string, rating: number | undefined})
            const title = event.active.id
            
            const newCategory = event.over?.id as string

            if (category == newCategory) {
              return
            }

            const { media: oldMedia, setMedia: setOldMedia} = categories[category]
            const { media: newMedia, setMedia: setNewMedia } = categories[newCategory]

            setOldMedia(oldMedia.filter(media => media.title != title))
            setNewMedia([...newMedia, { title: title, rating: rating }])

            
            
            

          }
        }
        >

          
        {
          
          Object.keys(categories).map(category =>
            <CategoryColumn categoryName={category} key={category} hoverColor={ categories[category].hoverColor }>
              {categories[category].media.sort((a, b) => a.title.localeCompare(b.title)).map((media) => <MediaCard category={category} title={media.title} rating={media.rating} key={media.title} ></MediaCard>)}
            </CategoryColumn>
          )
        }
        
      </DndContext>


    </div>
  );
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