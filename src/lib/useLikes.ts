"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const counterMeta = [
  { id: "ai", label: "AI likes" },
  { id: "human", label: "Human likes" },
] as const;

type CounterMeta = (typeof counterMeta)[number];
export type CounterId = CounterMeta["id"];

type LikeSnapshot = {
  id: CounterId;
  value: number;
};

const formatter = new Intl.NumberFormat("en-US");

async function postToggle(id: CounterId, liked: boolean) {
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
  const [baseCounts, setBaseCounts] = useState<Record<CounterId, number>>({});
  const [activeId, setActiveId] = useState<CounterId | null>(null);
  const [loaded, setLoaded] = useState(false);
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

        const initialCounts: Record<CounterId, number> = {
          ai: 0,
          human: 0,
        };

        for (const entry of data.likes) {
          initialCounts[entry.id] = entry.value;
        }

        setBaseCounts(initialCounts);
        setActiveId(null);
      } catch (error) {
        console.error("Failed to load likes", error);
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (targetId: CounterId) => {
      if (!loaded || pending) {
        return;
      }

      const previousActive = activeId;
      const previousBase = { ...baseCounts };
      const nextActive = previousActive === targetId ? null : targetId;

      setActiveId(nextActive);
      setPending(true);

      try {
        if (previousActive && previousActive !== targetId) {
          const resetValue = await postToggle(previousActive, false);
          setBaseCounts((current) => ({
            ...current,
            [previousActive]: resetValue,
          }));
        }

        const nextValue = await postToggle(targetId, nextActive === targetId);
        setBaseCounts((current) => ({
          ...current,
          [targetId]: nextActive === targetId ? Math.max(0, nextValue - 1) : nextValue,
        }));
      } catch (error) {
        console.error(error);
        setBaseCounts(previousBase);
        setActiveId(previousActive);
      } finally {
        setPending(false);
      }
    },
    [activeId, baseCounts, loaded, pending]
  );

  const counters = useMemo(() => {
    return counterMeta.map((meta) => {
      const base = baseCounts[meta.id] ?? 0;
      const active = activeId === meta.id;
      const value = base + (active ? 1 : 0);

      return {
        ...meta,
        display: loaded ? formatter.format(value) : "—",
        base,
        value,
        active,
      };
    });
  }, [activeId, baseCounts, loaded]);

  return {
    counters,
    toggle,
    pending,
    loaded,
  };
}
