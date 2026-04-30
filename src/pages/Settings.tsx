import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LogOut, Loader2, RotateCcw, Trash2, User as UserIcon, Palette, Image as ImageIcon, Volume2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ru, enUS, uz } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useI18n } from "@/contexts/I18nContext";
import { AvatarPicker } from "@/components/AvatarPicker";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { AppearanceSettings } from "@/components/AppearanceSettings";
import { SoundSettings } from "@/components/SoundSettings";
import { SecuritySettings } from "@/components/SecuritySettings";
import { InstallButton } from "@/components/InstallButton";
import { LangSwitcher } from "@/components/LangSwitcher";
import { formatMoney, getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const localeMap = { ru, uz, en: enUS };

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, update } = useProfile();
  const { t, lang } = useI18n();
  const dfns = localeMap[lang];

  const [name, setName] = useState(profile?.display_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [deleted, setDeleted] = useState<Transaction[]>([]);
  const [trashLoading, setTrashLoading] = useState(true);

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
    const { error } = await supabase
      .from("transactions")
      .update({ deleted_at: null })
      .eq("id", id);
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
      .from("transactions")
      .delete()
      .eq("user_id", user.id)
      .not("deleted_at", "is", null);
    if (error) toast.error(t("delete_failed"));
    else { toast.success(t("deleted")); loadTrash(); }
  };

  return (
    <div className="pb-32 max-w-md mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("settings")}</h1>
        <LangSwitcher />
      </div>

      {/* Profile */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <UserIcon className="h-4 w-4" /> {t("profile")}
        </div>
        <div className="mb-5">
          <AvatarPicker size={96} />
        </div>
        <div className="space-y-1.5">
          <Label>{t("display_name")}</Label>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("your_name")}
              className="h-12 bg-muted/50 border-border/50 rounded-2xl"
            />
            <Button
              onClick={saveName}
              disabled={savingName || name === (profile?.display_name ?? "")}
              className="h-12 px-5 rounded-2xl gradient-primary text-primary-foreground"
            >
              {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : t("save")}
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <Palette className="h-4 w-4" /> {t("appearance")}
        </div>
        <AppearanceSettings />
      </Card>

      {/* Sound */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <Volume2 className="h-4 w-4" /> {t("sound")}
        </div>
        <SoundSettings />
      </Card>

      {/* Security */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4" /> {t("security")}
        </div>
        <SecuritySettings onChangePin={() => window.location.reload()} />
      </Card>

      {/* Background */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <ImageIcon className="h-4 w-4" /> {t("background")}
        </div>
        <BackgroundPicker />
      </Card>

      {/* Install */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <InstallButton />
      </Card>

      {/* Trash */}
      <Card className="glass border-border/30 rounded-3xl p-5 mb-4 shadow-card-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Trash2 className="h-4 w-4" /> {t("trash")}
            {deleted.length > 0 && (
              <span className="text-xs text-muted-foreground/70">({deleted.length})</span>
            )}
          </div>
          {deleted.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-expense">
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
                  <AlertDialogAction
                    onClick={purgeAll}
                    className="rounded-2xl bg-expense text-expense-foreground hover:bg-expense/90"
                  >
                    {t("delete_forever")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {trashLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : deleted.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">{t("trash_empty")}</p>
        ) : (
          <div className="space-y-2">
            {deleted.map((tx) => {
              const cat = getCategory(tx.category);
              const isIncome = tx.type === "income";
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/30"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0 opacity-70",
                      isIncome ? "bg-income/15" : "bg-expense/15"
                    )}
                  >
                    {cat.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cat.name[lang]}</p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {format(parseISO(tx.occurred_on), "d MMM yyyy", { locale: dfns })}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold whitespace-nowrap",
                      isIncome ? "text-income" : "text-expense"
                    )}
                  >
                    {isIncome ? "+" : "−"}
                    {formatMoney(Number(tx.amount), lang)}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => restore(tx.id)}
                      className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center transition-smooth hover:bg-primary/25"
                      aria-label={t("restore")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => purge(tx.id)}
                      className="h-8 w-8 rounded-lg bg-expense/15 text-expense flex items-center justify-center transition-smooth hover:bg-expense/25"
                      aria-label={t("delete_forever")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Account */}
      <Card className="glass border-border/30 rounded-3xl p-5 shadow-card-soft">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
          {t("account")}
        </div>
        <p className="text-xs text-muted-foreground/70 mb-4 break-all">
          {user?.email?.replace("@phone.local", "")}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-expense/40 text-expense hover:bg-expense/10 hover:text-expense"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="glass border-border/30 rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("logout_confirm_title")}</AlertDialogTitle>
              <AlertDialogDescription>{t("logout_confirm_desc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-2xl">{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={signOut}
                className="rounded-2xl bg-expense text-expense-foreground hover:bg-expense/90"
              >
                {t("logout")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
};

export default Settings;
