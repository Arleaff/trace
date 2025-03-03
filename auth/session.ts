import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { db } from "../db";
import { cookies } from "next/headers";
import { cache } from "react";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    await db`INSERT INTO "MediaTracker".user_session (id, user_id, expires_at) VALUES (${session.id}, ${session.userId}, ${session.expiresAt})`;
    return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    // google ID may not be needed
    const [row] = await db`SELECT user_session.id, user_session.user_id, user_session.expires_at, app_user.id, app_user.username, app_user.google_id
    FROM "MediaTracker".user_session AS user_session 
    INNER JOIN "MediaTracker".app_user ON app_user.id = user_session.user_id 
    WHERE user_session.id = ${sessionId}`;    
    

    if (row === undefined) {
        return { session: null, user: null };
    }
    const session: Session = {
        id: sessionId,
        userId: row.user_id,
        expiresAt: row.expires_at
    };
    const user: User = {
        id: row.id,
        name: row.username,
        googleId: row.google_id
    };
    if (Date.now() >= session.expiresAt.getTime()) {
        const [result] = await db`DELETE FROM "MediaTracker".user_session WHERE id = ${session.id}`;

        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db`UPDATE user_session SET expires_at = ${session.expiresAt} WHERE id = ${session.id}`;
    }
    return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db`DELETE FROM user_session WHERE id = ${sessionId}`;
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db`DELETE FROM user_session WHERE user_id = ${userId}`;
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        path: "/"
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/"
    });
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
	const cookieStore = await cookies();
	const token = cookieStore.get("session")?.value ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validateSessionToken(token);
	return result;
});

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export interface Session {
    id: string;
    userId: number;
    expiresAt: Date;
}

export interface User {
    id: number;
    googleId: string;
    name: string;
}