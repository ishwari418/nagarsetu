import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";

const COOKIE = "nagarsetu_session";
const SECRET = process.env.SESSION_SECRET || "nagarsetu-dev-secret";

type Payload = { userId: string; role: string };

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex").slice(0, 32);
}

export function createSession(payload: Payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  cookies().set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function destroySession() {
  cookies().delete(COOKIE);
}

export function readSession(): Payload | null {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  const [body, sig] = raw.split(".");
  if (!body || !sig || sign(body) !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
  } catch {
    return null;
  }
}

export async function currentUser() {
  const session = readSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function requireCitizen() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "CITIZEN") redirect("/admin/dashboard");
  return user;
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "CITY_ADMIN") redirect("/citizen/dashboard");
  return user;
}
