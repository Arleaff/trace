import { Google } from "arctic";

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    process.env.URL ? `http://${process.env.URL}/login/google/callback` : "" 
);