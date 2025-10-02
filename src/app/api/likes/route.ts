import { NextResponse } from "next/server";
import { getLikes, setLike, type LikeTogglePayload } from "@/lib/kv";

function isLikeId(value: unknown): value is LikeTogglePayload["id"] {
  return value === "ai" || value === "human";
}

export async function GET() {
  const likes = await getLikes();
  return NextResponse.json({ likes });
}

export async function POST(request: Request) {
  let payload: LikeTogglePayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload || !isLikeId(payload.id) || typeof payload.liked !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const nextValue = await setLike(payload.id, payload.liked);

  return NextResponse.json({ id: payload.id, value: nextValue });
}
