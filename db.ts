'use server'
import { neon } from "@neondatabase/serverless";

export const db = neon(process.env.DATABASE_URL || "");

export async function getUserId(email: string) {

    // get user's Id
    const sql = neon(process.env.DATABASE_URL || "");
    const Id = await sql(`SELECT "UserId" FROM "MediaTracker"."users" WHERE "Email" = '${email}'`);

    // TODO: handle errors

    return Id[0].UserId;
}

export async function getUserLists(id: number) {

    const sql = neon(process.env.DATABASE_URL || "");

    // get users lists
    const lists = await sql(`SELECT "Name" FROM "MediaTracker"."lists" WHERE "UserId" = '${id}'`);

    return lists;
}

export async function getUserMedia(id: number, listName: string) {

    // get user's Id
    const sql = neon(process.env.DATABASE_URL || "");

    // get users media
    const media = await sql(`SELECT "Title", "Extra", "Rating", "Category" FROM "MediaTracker"."media" WHERE "UserId" = '${id}' AND "ListName" = '${listName}'`);




    return media;
}
