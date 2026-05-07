import { useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LogOut,
  Loader2,
  RotateCcw,
  Trash2,
  User as UserIcon,
  Palette,
  Image as ImageIcon,
  Volume2,
  ShieldCheck,
  Smartphone,
  Sun,
  Download,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { LANGUAGES } from "@/lib/i18n";
import { AvatarPicker } from "@/components/AvatarPicker";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { AppearanceSettings } from "@/components/AppearanceSettings";
import { SoundSettings } from "@/components/SoundSettings";
import { SecuritySettings } from "@/components/SecuritySettings";
import { InstallButton } from "@/components/InstallButton";
import { ThemeSettings } from "@/components/ThemeSettings";
import { DeviceSettings } from "@/components/DeviceSettings";
import { SettingsGroup, SettingsRow } from "@/components/SettingsRow";
import { Label } from "@/components/ui/label";
import { formatMoney, getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const localeMap = { ru, uz, en: enUS };

type SheetKey =
  | "profile"
  | "appearance"
  | "theme"
  | "sound"
  | "security"
  | "background"
  | "device"
  | "install"
  | "trash"
  | "language"
  | null;

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, update } = useProfile();
  const { t, lang, setLang } = useI18n();
  const { byId: catsById } = useCategories();
  const dfns = localeMap[lang];

  const [name, setName] = useState(profile?.display_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [deleted, setDeleted] = useState<Transaction[]>([]);
  const [trashLoading, setTrashLoading] = useState(true);
  const [openSheet, setOpenSheet] = useState<SheetKey>(null);

  useEffect(() => {
    setName(profile?.display_name ?? "");
  }, [profile?.display_name]);

  const loadTrash = async () => {
    if (!user) return;
    setTrashLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });
    setDeleted((data ?? []) as Transaction[]);
    setTrashLoading(false);
  };

  useEffect(() => { loadTrash(); /* eslint-disable-next-line */ }, [user]);

  const saveName = async () => {
    setSavingName(true);
    await update({ display_name: name.trim() || null });
    setSavingName(false);
    toast.success(t("saved"));
  };

  const restore = async (id: string) => {
    const { error } = await supabase.from("transactions").update({ deleted_at: null }).eq("id", id);
    if (error) toast.error(t("delete_failed"));
    else { toast.success(t("restored")); loadTrash(); }
  };

  const purge = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) toast.error(t("delete_failed"));
    else { toast.success(t("deleted")); loadTrash(); }
  };

  const purgeAll = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("transactions").delete()
      .eq("user_id", user.id).not("deleted_at", "is", null);
    if (error) toast.error(t("delete_failed"));
    else { toast.success(t("deleted")); loadTrash(); }
  };

  const sheetTitle: Record<Exclude<SheetKey, null>, string> = {
    profile: t("profile"),
    appearance: t("appearance"),
    theme: t("theme"),
    sound: t("sound"),
    security: t("security"),
    background: t("background"),
    device: t("device"),
    install: t("install_app"),
    trash: t("trash"),
    language: t("language") || "Language",
  };

  const renderSheet = (): ReactNode => {
    switch (openSheet) {
      case "profile":
        return (
          <div className="space-y-5">
            <div className="flex justify-center"><AvatarPicker size={96} /></div>
            <div className="space-y-1.5">
              <Label>{t("display_name")}</Label>
              <div className="flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t("your_name")}
                  className="h-12 bg-muted/50 border-border/50 rounded-2xl" />
                <Button onClick={saveName}
                  disabled={savingName || name === (profile?.display_name ?? "")}
                  className="h-12 px-5 rounded-2xl gradient-primary text-primary-foreground">
                  {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : t("save")}
                </Button>
              </div>
            </div>
          </div>
        );
      case "appearance": return <AppearanceSettings />;
      case "theme": return <ThemeSettings />;
      case "sound": return <SoundSettings />;
      case "security": return <SecuritySettings onChangePin={() => window.location.reload()} />;
      case "background": return <BackgroundPicker />;
      case "device": return <DeviceSettings />;
      case "install": return <InstallButton />;
      case "language":
        return (
          <div className="space-y-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpenSheet(null); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-smooth",
                  lang === l.code
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-muted/30 border-border/30 hover:bg-muted/50"
                )}
              >
                <span className="text-2xl">{l.flag}</span>
                <span className="font-medium flex-1 text-left">{l.label}</span>
                {lang === l.code && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        );
      case "trash":
        return trashLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : deleted.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">{t("trash_empty")}</p>
        ) : (
          <div className="space-y-2">
            {deleted.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-expense w-full justify-end">
                    {t("empty_trash")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass border-border/30 rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("empty_trash")}?</AlertDialogTitle>
                    <AlertDialogDescription>{t("delete_forever")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-2xl">{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={purgeAll}
                      className="rounded-2xl bg-expense text-expense-foreground hover:bg-expense/90">
                      {t("delete_forever")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {deleted.map((tx) => {
              const cat = catsById[tx.category] ?? getCategory(tx.category);
              const isIncome = tx.type === "income";
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/30">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 opacity-70",
                    isIncome ? "bg-income/15" : "bg-expense/15")}>{cat.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cat.name[lang]}</p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {format(parseISO(tx.occurred_on), "d MMM yyyy", { locale: dfns })}
                    </p>
                  </div>
                  <p className={cn("text-sm font-semibold whitespace-nowrap",
                    isIncome ? "text-income" : "text-expense")}>
                    {isIncome ? "+" : "−"}{formatMoney(Number(tx.amount), lang)}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => restore(tx.id)}
                      className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"
                      aria-label={t("restore")}><RotateCcw className="h-4 w-4" /></button>
                    <button onClick={() => purge(tx.id)}
                      className="h-8 w-8 rounded-lg bg-expense/15 text-expense flex items-center justify-center"
                      aria-label={t("delete_forever")}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <h1 className="text-3xl font-bold tracking-tight mb-5">{t("settings")}</h1>

      {/* Personal */}
      <div className="space-y-4">
        <SettingsGroup>
          <SettingsRow icon={UserIcon} iconBg="bg-[hsl(220_90%_55%)]" label={t("profile")}
            hint={profile?.display_name ?? ""}
            onClick={() => setOpenSheet("profile")} />
          <SettingsRow icon={Globe} iconBg="bg-[hsl(170_75%_45%)]" label={t("language") || "Language"}
            hint={lang.toUpperCase()}
            onClick={() => setOpenSheet("language")} />
        </SettingsGroup>

        {/* Look & feel */}
        <SettingsGroup>
          <SettingsRow icon={Palette} iconBg="bg-[hsl(280_75%_60%)]" label={t("appearance")}
            onClick={() => setOpenSheet("appearance")} />
          <SettingsRow icon={Sun} iconBg="bg-[hsl(38_95%_55%)]" label={t("theme")}
            onClick={() => setOpenSheet("theme")} />
          <SettingsRow icon={ImageIcon} iconBg="bg-[hsl(200_85%_55%)]" label={t("background")}
            onClick={() => setOpenSheet("background")} />
          <SettingsRow icon={Volume2} iconBg="bg-[hsl(150_70%_45%)]" label={t("sound")}
            onClick={() => setOpenSheet("sound")} />
        </SettingsGroup>

        {/* System */}
        <SettingsGroup>
          <SettingsRow icon={ShieldCheck} iconBg="bg-[hsl(150_75%_42%)]" label={t("security")}
            onClick={() => setOpenSheet("security")} />
          <SettingsRow icon={Smartphone} iconBg="bg-[hsl(220_15%_55%)]" label={t("device")}
            onClick={() => setOpenSheet("device")} />
          <SettingsRow icon={Download} iconBg="bg-[hsl(15_90%_58%)]" label={t("install_app")}
            onClick={() => setOpenSheet("install")} />
        </SettingsGroup>

        {/* Data */}
        <SettingsGroup>
          <SettingsRow icon={Trash2} iconBg="bg-[hsl(0_75%_55%)]" label={t("trash")}
            hint={deleted.length > 0 ? String(deleted.length) : undefined}
            onClick={() => setOpenSheet("trash")} />
        </SettingsGroup>

        {/* Account */}
        <SettingsGroup>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3 px-4 py-3 transition-smooth active:bg-muted/40 text-left">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 bg-expense text-white">
                  <LogOut className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <span className="flex-1 text-[15px] font-medium text-expense">{t("logout")}</span>
                <span className="text-xs text-muted-foreground/70 truncate max-w-[55%]">
                  {user?.email?.replace("@phone.local", "")}
                </span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass border-border/30 rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{t("logout_confirm_title")}</AlertDialogTitle>
                <AlertDialogDescription>{t("logout_confirm_desc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-2xl">{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={signOut}
                  className="rounded-2xl bg-expense text-expense-foreground hover:bg-expense/90">
                  {t("logout")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SettingsGroup>
      </div>

      <Sheet open={openSheet !== null} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent side="bottom"
          className="glass border-t border-border/30 rounded-t-3xl max-h-[85vh] overflow-y-auto pb-8">
          <SheetHeader className="mb-4">
            <SheetTitle>{openSheet ? sheetTitle[openSheet] : ""}</SheetTitle>
          </SheetHeader>
          {renderSheet()}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Settings;
