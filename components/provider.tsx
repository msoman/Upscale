"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Business, emptyBusiness } from "@/lib/business";
import { getSupabase } from "@/lib/supabase";
import { useStoredState } from "@/lib/use-stored-state";
const supabase = getSupabase();
type Context = {
  business: Business;
  save: (b: Business) => Promise<void>;
  ready: boolean;
  user: string | null;
  notice: string;
  token: () => Promise<string | null>;
};
const C = createContext<Context>({
  business: emptyBusiness,
  save: async () => {},
  ready: false,
  user: null,
  notice: "",
  token: async () => null,
});
const subscribe = () => () => {};
export function Provider({ children }: { children: React.ReactNode }) {
  const [local, setLocal] = useStoredState<Business>(
    "upscale-business",
    emptyBusiness,
  );
  const [cloud, setCloud] = useState<Business | null>(null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [user, setUser] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const business = cloud ?? local;
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      setUser(user?.email ?? null);
      setCloud(null);
      if (user) {
        const { data, error } = await supabase
          .from("businesses")
          .select("profile")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!active) return;
        if (error) setNotice(error.message);
        if (data) setCloud({ ...emptyBusiness, ...data.profile });
      }
    };
    void load();
    const { data } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => void load(), 0);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  const save = useCallback(
    async (b: Business) => {
      setLocal(b);
      setNotice("Saved on this browser.");
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("businesses")
            .upsert(
              { user_id: user.id, profile: b },
              { onConflict: "user_id" },
            );
          setCloud(b);
          setNotice(
            error
              ? `Cloud save failed: ${error.message}. Browser copy saved.`
              : "Saved securely to your account.",
          );
        }
      }
    },
    [setLocal],
  );
  const token = async () => {
    if (!supabase) return null;
    return (
      (await supabase.auth.getSession()).data.session?.access_token ?? null
    );
  };
  return (
    <C.Provider value={{ business, save, ready, user, notice, token }}>
      <div
        style={
          {
            "--brand": business.brandColor,
            fontFamily: business.font,
          } as React.CSSProperties
        }
        data-theme={business.appearance}
      >
        {children}
      </div>
    </C.Provider>
  );
}
export const useBusiness = () => useContext(C);
