import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  MapPin,
  Menu,
  MoreVertical,
  Download,
  Smartphone,
  Shield,
  Compass,
  BookOpen,
  Home as HomeIcon,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useLocationSettings } from "@/context/location";
import { LocationDialog } from "@/components/LocationDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IslamicCelestialBackground } from "@/components/IslamicCelestialBackground";
import { ShareekLogo } from "@/components/ShareekLogo";
import { AndroidInstallDialog } from "@/components/AndroidInstallDialog";
import { AndroidMoreDrawer } from "@/components/AndroidMoreDrawer";

const BOTTOM_NAV = [
  { to: "/", label: "Prayer", icon: "🕌" },
  { to: "/qibla", label: "Qibla", icon: "🧭" },
  { to: "/quran", label: "Quran", icon: "📖" },
  { to: "/pray-first", label: "Pray First", icon: "🛡️" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useLocationSettings();
  const [locationOpen, setLocationOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="relative min-h-screen bg-surface overflow-x-hidden text-deep antialiased select-none sm:select-auto pb-24 lg:pb-8">
      <IslamicCelestialBackground />

      {/* Top App Bar — Native Android Elevation & Standard Layout */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-hairline/70 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Left */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 no-underline group">
            <ShareekLogo className="size-8 sm:size-9 shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold text-deep tracking-tight font-display">
                  Shareek
                </span>
                <span className="text-[11px] font-arabic text-brand font-normal">
                  شَرِيك
                </span>
              </div>
            </div>
          </Link>

          {/* Center: PROMINENT LOCATION SELECTOR — ALWAYS VISIBLE & TOUCH-FRIENDLY */}
          <button
            type="button"
            onClick={() => setLocationOpen(true)}
            className="flex-1 max-w-xs sm:max-w-sm mx-1 sm:mx-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-panel/90 border border-hairline/90 hover:border-brand/40 hover:bg-mist/80 transition-all flex items-center justify-between gap-1.5 shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="size-3.5 text-brand shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-deep truncate">
                {location.name}
                {location.region ? `, ${location.region}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-deep/40 group-hover:text-brand">
              <span className="hidden md:inline text-[10px] font-mono">
                {Math.round(location.elevation)}m
              </span>
              <ChevronDown className="size-3.5" />
            </div>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Install / APK Pill */}
            <button
              type="button"
              onClick={() => setInstallOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 hover:bg-brand/15 text-brand text-xs font-semibold border border-brand/20 transition cursor-pointer"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Get App</span>
              <span className="inline sm:hidden font-mono text-[11px]">APK</span>
            </button>

            {/* Dark / Light Toggle */}
            <ThemeToggle />

            {/* Android More / Overflow Menu Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open More Options"
              className="p-2 rounded-full text-deep/70 hover:text-deep hover:bg-mist transition cursor-pointer"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>

        {/* Desktop Tablet Sub-Bar for Quick Access */}
        <div className="hidden lg:flex items-center justify-center gap-1 pt-2 max-w-7xl mx-auto border-t border-hairline/40 text-xs font-medium text-deep/70">
          {[
            { to: "/", label: "Prayer Times", icon: "🕌" },
            { to: "/qibla", label: "Qibla Finder", icon: "🧭" },
            { to: "/quran", label: "Noble Quran", icon: "📖" },
            { to: "/pray-first", label: "Khushūʿ Shield", icon: "🛡️" },
            { to: "/masjid", label: "Masajid", icon: "📍" },
            { to: "/asmaul-husna", label: "99 Names", icon: "✨" },
            { to: "/duas", label: "Adhkar & Duas", icon: "🤲" },
            { to: "/dhikr", label: "Tasbeeh", icon: "📿" },
            { to: "/tracker", label: "Tracker", icon: "📊" },
            { to: "/calendar", label: "Calendar", icon: "🗓️" },
            { to: "/contribute", label: "Contribute", icon: "💚" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-brand bg-brand/10 font-semibold" }}
              activeOptions={{ exact: item.to === "/" }}
              className="px-3 py-1 rounded-full hover:bg-mist hover:text-deep transition no-underline flex items-center gap-1.5"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <div className="relative z-10">{children}</div>

      {/* Modern Material 3 Bottom Navigation Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-panel/95 backdrop-blur-xl border-t border-hairline/80 px-2 pt-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-xl">
        <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
          {BOTTOM_NAV.map((item) => {
            const isActive =
              item.to === "/"
                ? currentPath === "/" || currentPath === "/faiz-sanctuary" || currentPath === "/faiz-sanctuary/"
                : currentPath.includes(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition no-underline select-none cursor-pointer ${
                  isActive
                    ? "text-brand font-semibold"
                    : "text-deep/60 hover:text-deep"
                }`}
              >
                <div
                  className={`w-12 h-7 rounded-full grid place-items-center transition-all ${
                    isActive ? "bg-brand/15 text-brand scale-105" : "bg-transparent"
                  }`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                </div>
                <span className="text-[10px] leading-tight font-medium tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* 5th Tab: More Button (Triggers Android Navigation Drawer) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-deep/60 hover:text-deep transition select-none cursor-pointer"
          >
            <div className="w-12 h-7 rounded-full grid place-items-center bg-transparent">
              <span className="text-lg leading-none">🎛️</span>
            </div>
            <span className="text-[10px] leading-tight font-medium tracking-tight whitespace-nowrap">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Dialog Modals */}
      <LocationDialog open={locationOpen} onClose={() => setLocationOpen(false)} />
      <AndroidInstallDialog open={installOpen} onClose={() => setInstallOpen(false)} />
      <AndroidMoreDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenLocation={() => setLocationOpen(true)}
        onOpenInstall={() => setInstallOpen(true)}
      />
    </div>
  );
}
