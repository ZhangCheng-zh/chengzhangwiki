import { createClient, type RedisClientType } from "redis";

const LIKE_KEYS = {
  ai: "likes:ai",
  human: "likes:human",
} as const;

type LikeId = keyof typeof LIKE_KEYS;

const DEFAULT_COUNTS: Record<LikeId, number> = {
  ai: 1024,
  human: 256,
};

let client: RedisClientType | null = null;

async function getClient(): Promise<RedisClientType> {
  if (client && client.isOpen) {
    return client;
  }

  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error("Missing REDIS_URL environment variable");
  }

  client = createClient({ url });
  client.on("error", (error) => {
    console.error("Redis client error", error);
  });

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}

export type LikeSnapshot = {
  id: LikeId;
  value: number;
};

export async function getLikes(): Promise<LikeSnapshot[]> {
  const redis = await getClient();
  const keys = Object.values(LIKE_KEYS);
  const results = await redis.mGet(keys);

  return (Object.keys(LIKE_KEYS) as LikeId[]).map((id, index) => {
    const raw = results[index];
    return {
      id,
      value: raw !== null ? Number(raw) : DEFAULT_COUNTS[id],
    } satisfies LikeSnapshot;
  });
}

export async function setLike(id: LikeId, liked: boolean) {
  const redis = await getClient();
  const key = LIKE_KEYS[id];
  const base = DEFAULT_COUNTS[id];
  const target = liked ? base + 1 : base;
  await redis.set(key, target.toString());
  return target;
}

export type LikeTogglePayload = {
  id: LikeId;
  liked: boolean;
};
