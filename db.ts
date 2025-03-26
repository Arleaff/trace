'use server'
import { neon } from "@neondatabase/serverless";
import { getCurrentSession } from "./auth/session";
import { Media } from "./app/home";

const COMPLETION_LEVELS = ['Pending', 'Ongoing', 'Finished', 'Dropped']

export const db = neon(process.env.DATABASE_URL || "");


export async function getLists() {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const lists = await sql`SELECT "name" FROM "MediaTracker"."lists" WHERE "user_id" = ${user?.id}`;

    return lists;
}

export async function addList(name: string) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const lists = await sql`INSERT INTO "MediaTracker"."lists" (name, user_id) VALUES (${name}, ${user?.id})`;

    return lists;
}

export async function editList(oldName: string, newName: string) {
    
    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    const lists = await sql`UPDATE "MediaTracker"."lists" SET name = ${newName} WHERE name = ${oldName} AND user_id = ${user?.id}`;

    return lists;
    
}



export async function deleteList(name: string) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    const lists = await sql`DELETE FROM "MediaTracker"."lists" WHERE name = ${name} AND user_id = ${user?.id}`;

    return lists[0];
}



export async function getMedia(list: string) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const media = await sql`SELECT "title", "rating", "category" FROM "MediaTracker"."media" WHERE "list_name" = ${list} AND "user_id" = ${user?.id}`;

    return media;
}

export async function addMedia(list: string, mediaToAdd: Media) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");
    const completionLevelIndex = COMPLETION_LEVELS.indexOf(mediaToAdd.completionLevel);
    
    // get users lists
    const media = await sql`INSERT INTO "MediaTracker".media (list_name, user_id, title, rating, category) VALUES (${list}, ${user?.id}, ${mediaToAdd.title}, ${mediaToAdd.rating ?? 0}, ${completionLevelIndex}) RETURNING *`;

    return media;
}

export async function editMedia(list: string, oldMedia: Media, newMedia: Media) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");
    const completionLevelIndex = COMPLETION_LEVELS.indexOf(newMedia.completionLevel);
    
    
    // get users lists
    const media = await sql`UPDATE "MediaTracker".media 
    SET rating = ${newMedia.rating ?? 0}, category = ${completionLevelIndex}, title = ${newMedia.title}
    WHERE list_name = ${list} AND user_id = ${user?.id} AND title = ${oldMedia.title} RETURNING *`;
    

    return media;
}

export async function deleteMedia(list: string, mediaToDelete: Media) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const media = await sql`DELETE FROM "MediaTracker".media WHERE list_name = ${list} AND user_id = ${user?.id} AND title = ${mediaToDelete.title} RETURNING *`;

    return media;
}
