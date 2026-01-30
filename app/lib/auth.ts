import { scryptAsync } from "@noble/hashes/scrypt.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { eq } from "drizzle-orm";
import { fetchDb, schema } from "../db";
import { redirect } from "react-router";

const { sessions } = schema;

export interface AuthUser {
  id: string;
  username: string;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  // Parse stored hash: $scrypt$salt$hash
  const parts = storedHash.split("$");
  if (parts.length !== 4 || parts[1] !== "scrypt") {
    return false;
  }

  const [, , salt, hash] = parts;

  // Re-compute hash with same parameters
  const derivedKey = await scryptAsync(password, salt, {
    N: 16384, // CPU/memory cost
    r: 8, // Block size
    p: 1, // Parallelization factor
    dkLen: 32, // Output length
  });

  const computedHash = bytesToHex(derivedKey);
  return computedHash === hash;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));

  const derivedKey = await scryptAsync(password, salt, {
    N: 16384, // CPU/memory cost
    r: 8, // Block size
    p: 1, // Parallelization factor
    dkLen: 32, // Output length
  });

  const hash = bytesToHex(derivedKey);
  return `$scrypt$${salt}$${hash}`;
}

export async function createSession(
  userId: string,
  env: { DB: D1Database }
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const db = fetchDb(env.DB);
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

export async function validateSession(
  sessionId: string,
  env: { DB: D1Database }
): Promise<AuthUser | null> {
  if (!sessionId) return null;

  const db = fetchDb(env.DB);
  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session.length) return null;

  const sessionData = session[0];
  if (new Date(sessionData.expiresAt) < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return {
    id: sessionData.userId,
    username: "admin", // Since we only have one user
  };
}

export async function deleteSession(
  sessionId: string,
  env: { DB: D1Database }
): Promise<void> {
  const db = fetchDb(env.DB);
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function requireAuth(
  request: Request,
  env: { DB: D1Database }
): Promise<{ user: AuthUser; response?: Response }> {
  const sessionId = request.headers
    .get("Cookie")
    ?.match(/session=([^;]+)/)?.[1];

  if (!sessionId) {
    return {
      user: {} as AuthUser,
      response: new Response("Unauthorized", { status: 401 }),
    };
  }

  const user = await validateSession(sessionId, env);

  if (!user) {
    return {
      user: {} as AuthUser,
      response: new Response("Unauthorized", { status: 401 }),
    };
  }

  return { user };
}

export function setSessionCookie(sessionId: string): Response {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`
  );
  return redirect("/admin/posts", { headers });
}

export function clearSessionCookie(redirectUrl: string): Response {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
  );

  return redirect(redirectUrl);
}
