'use server'
import { neon } from "@neondatabase/serverless";
import { getCurrentSession } from "./auth/session";

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


export async function getMedia(list: string) {

    const { user } = await getCurrentSession();


    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const lists = await sql`SELECT "title", "rating", "category" FROM "MediaTracker"."media" WHERE "list_name" = ${list} AND "user_id" = ${user?.id}`;

    return lists;
}

// export async function getListMedia(listName: string) {

//     const { user } = await getCurrentSession();


//     const sql = neon(process.env.DATABASE_URL || "");

//     // get users lists
//     const lists = await sql(`SELECT "list_name" FROM "MediaTracker"."lists" WHERE "user_id" = '${user?.id}'`);

//     return lists;
// }

export async function getUserMedia(id: number, listName: string) {

    // get user's Id
    const sql = neon(process.env.DATABASE_URL || "");

    // get users media
    const media = await sql(`SELECT "Title", "Extra", "Rating", "Category" FROM "MediaTracker"."media" WHERE "UserId" = '${id}' AND "ListName" = '${listName}'`);




    return media;
}
