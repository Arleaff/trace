import { Google } from "arctic";

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    "https://media-tracker-eight.vercel.app/login/google/callback"
);