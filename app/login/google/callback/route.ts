import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";
import { google } from "@/auth/oath";
import { createSession, generateSessionToken, setSessionTokenCookie } from "@/auth/session";
import { db } from "@/db";
import { ObjectParser } from "@pilcrowjs/object-parser";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieStore = await cookies();
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
    if (code === null || state === null || storedState === null || codeVerifier === null) {
        return new Response(null, {
            status: 400
        });
    }
    if (state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        // Invalid code or client credentials
        return new Response(null, {
            status: 400
        });
    }
    const claims = decodeIdToken(tokens.idToken());
    const claimsParser = new ObjectParser(claims);

    const googleUserId = claimsParser.getString("sub");
    const username = claimsParser.getString("name");

    // TODO: Replace this with your own DB query.
    const [existingUser] = await db`SELECT * FROM "MediaTracker".app_user WHERE google_id = ${googleUserId}`;    
    

    if (existingUser !== undefined) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id);
        await setSessionTokenCookie(sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    }

    // TODO: maybe define createUser() function elsewhere
    const [user] = await db`INSERT INTO "MediaTracker".app_user (username, google_id) VALUES (${username}, ${googleUserId})`

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/"
        }
    });
}

function getUserFromGoogleId(googleUserId: any) {
    throw new Error("Function not implemented.");
}
