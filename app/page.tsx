"use client"

import CategoryColumn from "@/components/column";
import MediaCard from "@/components/rating-card";
import { DndContext } from "@dnd-kit/core";
import Image from "next/image";

export default function Home() {

  // const statuses = ["Unstarted", "Ongoing", "Finished", "Dropped"]
  const categories = [
  { name: "Unstarted", 
    hoverColor: "rgb(128 128 128 / .1)",
    media: [
      { title: "Bleach", rating: undefined },
      { title: "HxH", rating: undefined }
    ]  }, 
  {
    name: "Ongoing",
    hoverColor: "rgb(82 204 207 / .2)",
    media: [
      { title: "Naruto", rating: 8.5 },
      { title: "That Time I Got Reincarnated as a Slime", rating: 8 }
    ]
  },
  {
    name: "Finished",
    hoverColor: "rgb( 64 201 103 / .1)",

    media: [
      { title: "Attack on Titan", rating: 10 },
      { title: "Cyberpunk Edgerunners", rating: 10 },
      { title: "Frieren", rating: 7.5 },
    ]  },
  {
    name: "Dropped",
    hoverColor: "rgb(243 16 141 / .1)",
    media: [
      { title: "Tower of God", rating: 7 }
    ]  },

  ]


  return (
    <div className="flex flex-row h-dvh w-full p-8">

      <DndContext onDragEnd={
        (event) => {
          console.log(event);
          
        }
      }>
        {
          categories.map(category =>
            <CategoryColumn categoryName={category.name} key={category.name} hoverColor={category.hoverColor}>
              {category.media.map(media => <MediaCard rating={media.rating} key={media.title} title={media.title}></MediaCard>)}
            </CategoryColumn>
          )
        }
      </DndContext>


    </div>
  );
}
