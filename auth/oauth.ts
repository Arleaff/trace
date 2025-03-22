import { Google } from "arctic";

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    "https://" + process.env.VERCEL_URL + "/login/google/callback"
);