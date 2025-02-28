import { Media } from "./app/home";

export const MEDIA_LISTS: {
    listName: string;
    media: Media[];
}[] = [ 
    {   listName: "Anime",
        // media: [...Array(1000).keys()].map( i => { return { title: i.toString(), rating: null, completionLevel: "Ongoing", extra: null }} )
        media: [
            { title: "Bleach", rating: null, completionLevel: "Unstarted", extra: null },
            { title: "HxH", rating: null, completionLevel: "Unstarted", extra: null },

            { title: "Naruto", rating: 8.5, completionLevel: "Ongoing", extra: null },
            { title: "Re:Zero", rating: 9.5, completionLevel: "Ongoing", extra: null },
            { title: "That Time I Got Reincarnated as a Slime", rating: 8, completionLevel: "Ongoing", extra: null },

            { title: "Attack on Titan", rating: 10, completionLevel: "Finished", extra: null },
            { title: "Cyberpunk Edgerunners", rating: 10, completionLevel: "Finished", extra: null },
            { title: "Vinland Sage", rating: 10, completionLevel: "Finished", extra: null },
            { title: "One Punch Man", rating: 7, completionLevel: "Finished", extra: null },
            { title: "JJK", rating: 8.5, completionLevel: "Finished", extra: null },
            { title: "Dandadan", rating: 8.5, completionLevel: "Finished", extra: null },
            { title: "Kaiju No. 8", rating: 8.5, completionLevel: "Finished", extra: null },
            { title: "Chainsaw Man", rating: 9, completionLevel: "Finished", extra: null },
            { title: "Frieren", rating: 7.5, completionLevel: "Finished", extra: null },

            { title: "Tower of God", rating: 7, completionLevel: "Dropped", extra: null },
            { title: "Made in Abyss", rating: 8, completionLevel: "Dropped", extra: null }
        ]
    },

    {   listName: "Games",

        media: [
            { title: "Control", rating: null, completionLevel: "Unstarted", extra: null },

            { title: "God of War: Ragnarok", rating: null, completionLevel: "Ongoing", extra: null },

            { title: "Subanautica", rating: 10, completionLevel: "Finished", extra: null },
            { title: "God of War (2018)", rating: 9.5, completionLevel: "Finished", extra: null }, // perfect example of why edits are necessary, used to be "God of War"

            { title: "Hades", rating: 10, completionLevel: "Dropped", extra: null },
            { title: "Elden Ring", rating: 9, completionLevel: "Dropped", extra: null },
            { title: "Hollow Knight", rating: 8, completionLevel: "Dropped", extra: null },
            { title: "Risk of Rain 2", rating: 10, completionLevel: "Dropped", extra: null },
            { title: "Outer Wilds", rating: null, completionLevel: "Dropped", extra: null },
            { title: "Subnautica: Below Zero", rating: null, completionLevel: "Dropped", extra: null },
            { title: "Terraria", rating: 10, completionLevel: "Dropped", extra: null },
            { title: "Cuberpunk", rating: 0, completionLevel: "Dropped", extra: null }

        ]
    }
]