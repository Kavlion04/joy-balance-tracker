import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import type { Profile } from "@/lib/types";

interface ProfileCtx {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  update: (patch: Partial<Profile>) => Promise<void>;
}

const Ctx = createContext<ProfileCtx>({
  profile: null,
  loading: true,
  refresh: async () => {},
  update: async () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = async (patch: Partial<Profile>) => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .update(patch)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();
    if (data) setProfile(data as Profile);
  };

  return (
    <Ctx.Provider value={{ profile, loading, refresh, update }}>
      {children}
    </Ctx.Provider>
  );
};

export const useProfile = () => useContext(Ctx);
