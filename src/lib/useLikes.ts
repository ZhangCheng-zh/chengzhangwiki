"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

function createInitialCounts(): Record<CounterId, number> {
  return counterMeta.reduce((acc, meta) => {
    acc[meta.id] = 0;
    return acc;
  }, {} as Record<CounterId, number>);
}

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
  const [baseCounts, setBaseCounts] = useState<Record<CounterId, number>>(createInitialCounts);
  const [displayCounts, setDisplayCounts] = useState<Record<CounterId, number>>(createInitialCounts);
  const [activeId, setActiveId] = useState<CounterId | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const displayRef = useRef(displayCounts);

  useEffect(() => {
    displayRef.current = displayCounts;
  }, [displayCounts]);

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

        const initialCounts = createInitialCounts();
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

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const start = displayRef.current;
    const targets = counterMeta.reduce((acc, meta) => {
      acc[meta.id] = baseCounts[meta.id] ?? 0;
      return acc;
    }, {} as Record<CounterId, number>);

    const duration = 240;
    const startTime = performance.now();
    let frameId: number;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const nextCounts = createInitialCounts();

      for (const meta of counterMeta) {
        const initial = start[meta.id] ?? 0;
        const target = targets[meta.id];
        const value = Math.round(initial + (target - initial) * progress);
        nextCounts[meta.id] = value;
      }

      setDisplayCounts(nextCounts);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [baseCounts, loaded]);

  const toggle = useCallback(
    async (targetId: CounterId) => {
      if (!loaded || pending) {
        return;
      }

      const previousActive = activeId;
      const previousBase = { ...baseCounts };
      const nextActive = previousActive === targetId ? null : targetId;

      const optimistic = { ...baseCounts };

      if (nextActive === targetId) {
        optimistic[targetId] = (optimistic[targetId] ?? 0) + 1;
      } else {
        optimistic[targetId] = Math.max(0, (optimistic[targetId] ?? 0) - 1);
      }

      if (previousActive && previousActive !== targetId) {
        optimistic[previousActive] = Math.max(
          0,
          (optimistic[previousActive] ?? 0) - 1,
        );
      }

      setBaseCounts(optimistic);
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
          [targetId]: nextValue,
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
      const value = displayCounts[meta.id] ?? 0;
      return {
        ...meta,
        display: loaded ? formatter.format(value) : "0",
        value,
        active: activeId === meta.id,
      };
    });
  }, [activeId, displayCounts, loaded]);

  return {
    counters,
    toggle,
    pending,
    loaded,
  };
}
