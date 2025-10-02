"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const counterMeta = [
  { id: "ai", label: "AI likes", base: 1024 },
  { id: "human", label: "Human likes", base: 256 },
] as const;

type CounterMeta = (typeof counterMeta)[number];
export type CounterId = CounterMeta["id"];

interface LikeSnapshot {
  id: CounterId;
  value: number;
}

const formatter = new Intl.NumberFormat("en-US");

function createInitialState() {
  return counterMeta.reduce((acc, item) => {
    acc[item.id] = item.base;
    return acc;
  }, {} as Record<CounterId, number>);
}

async function apiToggle(id: CounterId, liked: boolean) {
  const response = await fetch("/api/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, liked }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update like for ${id}`);
  }

  const data = (await response.json()) as LikeSnapshot;
  return data.value;
}

export function useLikes() {
  const [counts, setCounts] = useState<Record<CounterId, number>>(createInitialState);
  const [activeId, setActiveId] = useState<CounterId | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const response = await fetch("/api/likes", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { likes: LikeSnapshot[] };

        if (!data?.likes || cancelled) {
          return;
        }

        const nextCounts = createInitialState();
        let nextActive: CounterId | null = null;

        for (const entry of data.likes) {
          if (!entry) {
            continue;
          }

          if (entry.id in nextCounts) {
            nextCounts[entry.id] = entry.value;
          }

          const meta = counterMeta.find((item) => item.id === entry.id);
          if (meta && entry.value > meta.base) {
            nextActive = entry.id;
          }
        }

        setCounts(nextCounts);
        setActiveId(nextActive);
      } catch (error) {
        console.error("Failed to load likes", error);
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (targetId: CounterId) => {
      if (pending) {
        return;
      }

      const previousActive = activeId;
      const previousCounts = { ...counts };

      const nextActive = activeId === targetId ? null : targetId;
      const optimistic = createInitialState();
      for (const meta of counterMeta) {
        const isActive = meta.id === nextActive;
        optimistic[meta.id] = meta.base + (isActive ? 1 : 0);
      }

      setPending(true);
      setCounts(optimistic);
      setActiveId(nextActive);

      try {
        if (previousActive && previousActive !== targetId) {
          const resetValue = await apiToggle(previousActive, false);
          setCounts((current) => ({
            ...current,
            [previousActive]: resetValue,
          }));
        }

        const nextValue = await apiToggle(targetId, nextActive === targetId);
        setCounts((current) => ({
          ...current,
          [targetId]: nextValue,
        }));
      } catch (error) {
        console.error(error);
        setCounts(previousCounts);
        setActiveId(previousActive);
      } finally {
        setPending(false);
      }
    },
    [activeId, counts, pending]
  );

  const formattedCounts = useMemo(() => {
    return counterMeta.map((meta) => ({
      ...meta,
      value: counts[meta.id],
      display: formatter.format(counts[meta.id]),
      active: activeId === meta.id,
    }));
  }, [activeId, counts]);

  return {
    counters: formattedCounts,
    toggle,
    pending,
  };
}
