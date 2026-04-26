import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Phone-as-email trick: store phone as <digits>@phone.local so Supabase email auth works without SMS
const phoneToEmail = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `${digits}@phone.local`;
};
const normalizePhone = (raw: string) => {
  let v = raw.replace(/[^\d+]/g, "");
  if (!v.startsWith("+")) v = "+" + v;
  return v;
};

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("+998");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizePhone(phone);
    if (normalized.replace(/\D/g, "").length < 9) {
      toast.error("Введите корректный номер");
      return;
    }
    if (password.length < 6) {
      toast.error("Пароль минимум 6 символов");
      return;
    }
    setLoading(true);
    const email = phoneToEmail(normalized);

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message.includes("already") ? "Этот номер уже зарегистрирован" : error.message);
      } else {
        toast.success("Регистрация успешна!");
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Неверный номер или пароль");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass w-full max-w-md p-8 rounded-3xl border-border/30 shadow-card-soft">
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 rounded-3xl gradient-primary flex items-center justify-center mb-4 shadow-fab">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Финансы</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 mb-6 rounded-2xl bg-muted/50">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "py-2.5 rounded-xl text-sm font-medium transition-smooth",
                mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {m === "login" ? "Вход" : "Регистрация"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Номер телефона</Label>
            <Input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 bg-muted/50 border-border/50 rounded-2xl"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Пароль</Label>
            <Input
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-muted/50 border-border/50 rounded-2xl"
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl gradient-primary text-primary-foreground font-semibold transition-bounce"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>

        <p className="text-[11px] text-muted-foreground/70 text-center mt-6">
          Ваши данные защищены. Доступ только по вашему паролю.
        </p>
      </Card>
    </div>
  );
};

export default Auth;
