"use client";

import { useCallback, useEffect, useState } from "react";
import type { TravelProfile } from "@/lib/ai-modes";

const STORAGE_KEY = "travel-guide-profile";

export function useTravelProfile() {
  const [profile, setProfileState] = useState<TravelProfile>("any");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored === "any" ||
        stored === "family" ||
        stored === "couple" ||
        stored === "budget" ||
        stored === "active"
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfileState(stored);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setProfile = useCallback((next: TravelProfile) => {
    setProfileState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { profile, setProfile, ready };
}
