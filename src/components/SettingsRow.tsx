import { ReactNode } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  iconBg: string;
  iconFg?: string;
  label: string;
  hint?: ReactNode;
  onClick?: () => void;
  asChild?: boolean;
}

export const SettingsRow = ({ icon: Icon, iconBg, iconFg = "text-white", label, hint, onClick }: Props) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 transition-smooth active:bg-muted/40 text-left"
  >
    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", iconBg, iconFg)}>
      <Icon className="h-5 w-5" strokeWidth={2.2} />
    </div>
    <span className="flex-1 text-[15px] font-medium truncate">{label}</span>
    {hint && <span className="text-xs text-muted-foreground truncate max-w-[40%]">{hint}</span>}
    <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0" />
  </button>
);

export const SettingsGroup = ({ children }: { children: ReactNode }) => (
  <div className="rounded-3xl bg-card/60 border border-border/30 overflow-hidden divide-y divide-border/30 shadow-card-soft">
    {children}
  </div>
);
