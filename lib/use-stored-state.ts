"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";
const EVENT = "upscale-storage";
export function useStoredState<T>(
  key: string,
  fallback: T,
  session = false,
): [T, (next: T) => void] {
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("storage", notify);
    window.addEventListener(EVENT, notify);
    return () => {
      window.removeEventListener("storage", notify);
      window.removeEventListener(EVENT, notify);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  }, [key, session]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const value = useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
  const setValue = useCallback(
    (next: T) => {
      (session ? sessionStorage : localStorage).setItem(
        key,
        JSON.stringify(next),
      );
      window.dispatchEvent(new Event(EVENT));
    },
    [key, session],
  );
  return [value, setValue];
}
