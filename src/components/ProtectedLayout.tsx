import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { WelcomeModal } from "./WelcomeModal";
import { PinLock } from "./PinLock";
import { isUnlocked } from "@/lib/pinLock";
import { playWelcomeChimeOncePerSession, isChimeEnabled } from "@/lib/welcomeChime";

export const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (user) setUnlocked(isUnlocked(user.id));
  }, [user]);

  useEffect(() => {
    if (!user || !unlocked || !isChimeEnabled()) return;
    const trigger = () => {
      playWelcomeChimeOncePerSession();
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
    };
    // Try immediately (works if AudioContext is already unlocked)
    playWelcomeChimeOncePerSession();
    // Fallback: play on first interaction
    window.addEventListener("pointerdown", trigger, { once: true });
    window.addEventListener("keydown", trigger, { once: true });
    return () => {
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
    };
  }, [user, unlocked]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (!unlocked) return <PinLock onUnlocked={() => setUnlocked(true)} />;
  return (
    <div className="min-h-screen">
      <WelcomeModal />
      {children}
      <BottomNav />
    </div>
  );
};
