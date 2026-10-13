import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useLocationSettings } from "@/context/location";
import { LocationDialog } from "@/components/LocationDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppExtras } from "@/components/AppExtras";
import { IslamicCelestialBackground } from "@/components/IslamicCelestialBackground";
import { ContributeSection } from "@/components/ContributeSection";

const NAV = [
  { to: "/", label: "Prayer Times" },
  { to: "/quran", label: "Quran" },
  { to: "/masjid", label: "Masajid" },
  { to: "/asmaul-husna", label: "99 Names" },
  { to: "/duas", label: "Adhkar & Duas" },
  { to: "/qibla", label: "Qibla" },
  { to: "/dhikr", label: "Dhikr" },
  { to: "/tracker", label: "Tracker" },
  { to: "/calendar", label: "Calendar" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { location } = useLocationSettings();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      <IslamicCelestialBackground />
      <header className="relative z-10 px-4 sm:px-6 py-5 flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-brand/90 grid place-items-center text-primary-foreground font-arabic font-bold text-lg shadow-lg shadow-brand/20">
            ش
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-deep tracking-tight font-display">Shareek</span>
            <span className="text-xs font-arabic text-brand/80">شَرِيك</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-brand/60 ml-1">
              Prayer · Quran · Sunnah
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-deep/70">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-brand font-semibold" }}
              activeOptions={{ exact: item.to === "/" }}
              className="hover:text-brand transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <AppExtras />
          <ThemeToggle />
          <a
            href="#contribute"
            className="hidden md:inline text-sm font-semibold text-deep/70 hover:text-brand transition whitespace-nowrap"
          >
            Contribute
          </a>
          <Link to="/about" className="text-sm font-semibold text-brand hover:text-deep transition whitespace-nowrap">
            About
          </Link>
          <span className="hidden sm:inline text-xs font-medium text-deep/60 bg-panel/60 backdrop-blur-md px-3 py-2 rounded-xl border border-hairline">
            {location.name}
            {location.region ? `, ${location.region}` : ""}
          </span>
          <button
            onClick={() => setOpen(true)}
            className="bg-brand text-primary-foreground text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl shadow-lg shadow-brand/25 hover:bg-deep transition whitespace-nowrap"
          >
            Set Location
          </button>
        </div>
      </header>

      <div className="relative z-10">{children}</div>

      <ContributeSection />

      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-deep/50">
        <p>
          Shareek (شَرِيك) · Prayer times, Quran, Masajid, 99 Names, Adhkar, Qibla, and daily worship tracker in one place.
        </p>
        <div className="flex gap-5">
          <a href="#contribute" className="font-semibold text-brand hover:text-deep transition">Contribute</a>
          <Link to="/about" className="font-semibold text-brand hover:text-deep transition">About</Link>
          <Link to="/methodology" className="font-semibold text-brand hover:text-deep transition">View methodology →</Link>
        </div>
      </footer>

      <nav className="lg:hidden sticky bottom-0 z-20 glass-panel rounded-none border-x-0 border-b-0 flex overflow-x-auto px-2 py-2">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "text-brand bg-mist/70" }}
            activeOptions={{ exact: item.to === "/" }}
            className="min-w-[74px] flex-1 text-center text-[11px] font-medium text-deep/60 py-2 rounded-xl"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <LocationDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
