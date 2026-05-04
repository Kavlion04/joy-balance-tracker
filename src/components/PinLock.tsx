import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Loader2, Fingerprint, Delete } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import {
  hasPin,
  setPin,
  verifyPin,
  isValidPin,
  markUnlocked,
  hasBiometric,
  isBiometricSupported,
  isPlatformAuthenticatorAvailable,
  enrollBiometric,
  unlockWithBiometric,
} from "@/lib/pinLock";
import { cn } from "@/lib/utils";

type Mode = "create" | "confirm" | "unlock";

export const PinLock = ({ onUnlocked }: { onUnlocked: () => void }) => {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const uid = user!.id;
  const initialMode: Mode = hasPin(uid) ? "unlock" : "create";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [pin, setPinValue] = useState("");
  const pinRef = useRef(""); // synchronous mirror to avoid stale-state races between rapid taps
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const triedBio = useRef(false);
  const [platformBio, setPlatformBio] = useState(false);
  const [offerBio, setOfferBio] = useState(false);
  

  // Async-detect Face ID / Touch ID / Android fingerprint
  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setPlatformBio);
  }, []);

  const setPinSafe = (v: string) => {
    pinRef.current = v;
    setPinValue(v);
  };

  // Auto-try biometric unlock on mount (silent — iOS may ignore without gesture, that's ok)
  useEffect(() => {
    if (mode !== "unlock" || triedBio.current) return;
    triedBio.current = true;
    if (hasBiometric(uid) && isBiometricSupported()) {
      unlockWithBiometric(uid).then((ok) => {
        if (ok) onUnlocked();
      });
    }
  }, [mode, uid, onUnlocked]);

  const fail = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setPinSafe("");
  };

  const handleComplete = async (value: string) => {
    setBusy(true);
    try {
      if (mode === "create") {
        if (!isValidPin(value)) {
          fail(t("pin_invalid"));
          return;
        }
        setFirstPin(value);
        setPinSafe("");
        setMode("confirm");
        setError(null);
      } else if (mode === "confirm") {
        if (value !== firstPin) {
          fail(t("pin_mismatch"));
          setMode("create");
          setFirstPin("");
          return;
        }
        await setPin(uid, value);
        markUnlocked(uid);
        toast.success(t("pin_set"));
        // Defer biometric enrollment to a user-gesture button (required by iOS Safari)
        if (platformBio && !hasBiometric(uid)) {
          setOfferBio(true);
        } else {
          onUnlocked();
        }
      } else {
        const ok = await verifyPin(uid, value);
        if (!ok) {
          fail(t("pin_wrong"));
          return;
        }
        markUnlocked(uid);
        onUnlocked();
      }
    } finally {
      setBusy(false);
    }
  };

  const press = (digit: string) => {
    if (busy) return;
    setError(null);
    const current = pinRef.current;
    if (current.length >= 4) return;
    const next = current + digit;
    setPinSafe(next);
    if (next.length === 4) handleComplete(next);
  };
  const backspace = () => {
    if (busy) return;
    setError(null);
    setPinSafe(pinRef.current.slice(0, -1));
  };

  const tryBiometric = async () => {
    const ok = await unlockWithBiometric(uid);
    if (ok) onUnlocked();
    else toast.error(t("biometric_failed"));
  };

  const title =
    mode === "create" ? t("pin_create_title") :
    mode === "confirm" ? t("pin_confirm_title") :
    t("pin_unlock_title");
  const subtitle =
    mode === "create" ? t("pin_create_sub") :
    mode === "confirm" ? t("pin_confirm_sub") :
    t("pin_unlock_sub");

  const showBio = mode === "unlock" && hasBiometric(uid) && isBiometricSupported();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass w-full max-w-sm p-7 rounded-3xl border-border/30 shadow-card-soft">
        <div className="flex flex-col items-center mb-5">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-3 shadow-fab">
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground mt-1 text-center">{subtitle}</p>
        </div>

        <div className={cn("flex justify-center gap-3 mb-2", shake && "animate-[shake_0.4s]")}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-3.5 w-3.5 rounded-full border-2 transition-all",
                pin.length > i ? "bg-primary border-primary scale-110" : "border-border"
              )}
            />
          ))}
        </div>
        <div className="h-5 text-center text-xs text-expense">{error}</div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {["1","2","3","4","5","6","7","8","9"].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              disabled={busy}
              className="h-14 rounded-2xl bg-muted/60 hover:bg-muted active:scale-95 transition-all text-xl font-medium"
            >
              {d}
            </button>
          ))}
          <button
            onClick={showBio ? tryBiometric : undefined}
            disabled={busy || !showBio}
            className={cn(
              "h-14 rounded-2xl transition-all flex items-center justify-center",
              showBio ? "bg-muted/60 hover:bg-muted active:scale-95" : "opacity-0 pointer-events-none"
            )}
            aria-label={t("biometric_unlock")}
          >
            <Fingerprint className="h-6 w-6 text-primary" />
          </button>
          <button
            onClick={() => press("0")}
            disabled={busy}
            className="h-14 rounded-2xl bg-muted/60 hover:bg-muted active:scale-95 transition-all text-xl font-medium"
          >
            0
          </button>
          <button
            onClick={backspace}
            disabled={busy || pin.length === 0}
            className="h-14 rounded-2xl bg-muted/60 hover:bg-muted active:scale-95 transition-all flex items-center justify-center disabled:opacity-40"
            aria-label="Backspace"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>

        {busy && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {mode === "unlock" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 text-xs text-muted-foreground"
            onClick={() => signOut()}
          >
            {t("logout")}
          </Button>
        )}
      </Card>
    </div>
  );
};
