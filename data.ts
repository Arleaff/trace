import { CompletionLevels, media } from "./app/page";

export const MEDIA_LISTS: {
    listName: string;
    media: media[];
}[] = [ 
    {   listName: "Anime",
        media: [...Array(100).keys()].map( i => { return { title: i.toString(), rating: null, completionLevel: "Ongoing" }} )
        //     { title: "Cyberpunk Edgerunners", rating: 10, completionLevel: "Finished" },
        // media: [
        //     { title: "Bleach", rating: null, completionLevel: "Unstarted" },
        //     { title: "HxH", rating: null, completionLevel: "Unstarted" },

        //     { title: "Naruto", rating: 8.5, completionLevel: "Ongoing" },
        //     { title: "Re:Zero", rating: 9.5, completionLevel: "Ongoing" },
        //     { title: "That Time I Got Reincarnated as a Slime", rating: 8, completionLevel: "Ongoing" },

        //     { title: "Attack on Titan", rating: 10, completionLevel: "Finished" },
        //     { title: "Cyberpunk Edgerunners", rating: 10, completionLevel: "Finished" },
        //     { title: "Vinland Sage", rating: 10, completionLevel: "Finished" },
        //     { title: "One Punch Man", rating: 7, completionLevel: "Finished" },
        //     { title: "JJK", rating: 8.5, completionLevel: "Finished" },
        //     { title: "Dandadan", rating: 8.5, completionLevel: "Finished" },
        //     { title: "Kaiju No. 8", rating: 8.5, completionLevel: "Finished" },
        //     { title: "Chainsaw Man", rating: 9, completionLevel: "Finished" },
        //     { title: "Frieren", rating: 7.5, completionLevel: "Finished" },

        //     { title: "Tower of God", rating: 7, completionLevel: "Dropped" },
        //     { title: "Made in Abyss", rating: 8, completionLevel: "Dropped" }
        // ]
    },

    {   listName: "Games",

        media: [
            { title: "Control", rating: null, completionLevel: "Unstarted" },

            { title: "God of War: Ragnarok", rating: null, completionLevel: "Ongoing" },

            { title: "Subanautica", rating: 10, completionLevel: "Finished" },
            { title: "God of War (2018)", rating: 9.5, completionLevel: "Finished" }, // perfect example of why edits are necessary, used to be "God of War"

            { title: "Hades", rating: 10, completionLevel: "Dropped" },
            { title: "Elden Ring", rating: 9, completionLevel: "Dropped" },
            { title: "Hollow Knight", rating: 8, completionLevel: "Dropped" },
            { title: "Risk of Rain 2", rating: 10, completionLevel: "Dropped" },
            { title: "Outer Wilds", rating: null, completionLevel: "Dropped" },
            { title: "Subnautica: Below Zero", rating: null, completionLevel: "Dropped" },
            { title: "Terraria", rating: 10, completionLevel: "Dropped" },
            { title: "Cuberpunk", rating: 0, completionLevel: "Dropped" }

        ]
    }
]