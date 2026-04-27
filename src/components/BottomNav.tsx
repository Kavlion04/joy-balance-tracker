import { NavLink, useLocation } from "react-router-dom";
import { Home, PieChart, Filter, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

export const BottomNav = () => {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const items = [
    { to: "/", icon: Home, label: t("nav_home") },
    { to: "/stats", icon: PieChart, label: t("nav_stats") },
    { to: "/filter", icon: Filter, label: t("nav_filter") },
    { to: "/settings", icon: Settings, label: t("nav_settings") },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-2">
      <div className="glass mx-auto max-w-md rounded-2xl px-2 py-2 flex items-center justify-around shadow-card-soft">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-smooth",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-bounce", active && "scale-110")} />
              <span className="text-[10px] font-medium">{it.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
