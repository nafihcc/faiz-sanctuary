import { Link } from "@tanstack/react-router";
import {
  X,
  Compass,
  BookOpen,
  MapPin,
  Sparkles,
  HeartHandshake,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Smartphone,
  Shield,
  Sliders,
  Info,
  CheckCircle2,
  ChevronRight,
  Moon,
  Sun,
  Activity,
} from "lucide-react";
import { ShareekLogo } from "@/components/ShareekLogo";
import { useLocationSettings } from "@/context/location";

export function AndroidMoreDrawer({
  open,
  onClose,
  onOpenLocation,
  onOpenInstall,
}: {
  open: boolean;
  onClose: () => void;
  onOpenLocation: () => void;
  onOpenInstall: () => void;
}) {
  const { location } = useLocationSettings();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-center items-center bg-deep/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[88vh] overflow-y-auto bg-panel rounded-t-[32px] lg:rounded-3xl p-5 sm:p-7 border border-hairline shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Android Sheet Handle */}
        <div className="w-12 h-1.5 rounded-full bg-deep/20 mx-auto -mt-1 mb-2 lg:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <div className="flex items-center gap-3">
            <ShareekLogo className="size-9 shrink-0 drop-shadow-sm" />
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-base font-bold text-deep font-display">Shareek Station</h3>
                <span className="text-xs font-arabic text-brand">شَرِيك</span>
              </div>
              <p className="text-[11px] text-deep/60">
                All Islamic utilities, prayer tools & settings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-deep/60 hover:text-deep hover:bg-mist transition cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Location Banner Quick-Tile */}
        <div
          onClick={() => {
            onClose();
            onOpenLocation();
          }}
          className="p-3.5 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-between gap-3 hover:bg-brand/15 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-brand/20 grid place-items-center text-brand shrink-0">
              <MapPin className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-deep">Active Location:</span>
                <span className="text-xs font-semibold text-brand">
                  {location.name}
                  {location.region ? `, ${location.region}` : ""}
                </span>
              </div>
              <span className="text-[11px] text-deep/60 font-mono">
                {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E · {Math.round(location.elevation)}m alt
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-brand bg-panel px-2.5 py-1 rounded-full shadow-2xs shrink-0">
            Change ✎
          </span>
        </div>

        {/* Section 1: Sacred Utilities Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-deep/40 px-1">
            Islamic Utilities
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: "/qibla", icon: "🧭", label: "Qibla Finder", sub: "AR & Magnetic" },
              { to: "/quran", icon: "📖", label: "Noble Quran", sub: "114 Surahs Audio" },
              { to: "/pray-first", icon: "🛡️", label: "Pray First", sub: "App Blocker" },
              { to: "/masjid", icon: "🕌", label: "Masajid Radar", sub: "Nearby Finder" },
              { to: "/asmaul-husna", icon: "✨", label: "99 Names", sub: "Asmaul Husna" },
              { to: "/duas", icon: "🤲", label: "Adhkar & Duas", sub: "Hisn al-Muslim" },
              { to: "/dhikr", icon: "📿", label: "Digital Tasbeeh", sub: "Tally Counter" },
              { to: "/tracker", icon: "📊", label: "Salah Tracker", sub: "Daily Checklist" },
              { to: "/calendar", icon: "🗓️", label: "Hijri Timetable", sub: "Monthly Times" },
              { to: "/methodology", icon: "📐", label: "Methodology", sub: "Calculations" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="p-3 rounded-2xl bg-panel border border-hairline hover:border-brand/30 hover:bg-mist/50 transition flex items-center gap-2.5 no-underline group"
              >
                <span className="text-xl p-1.5 rounded-xl bg-mist group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-deep truncate group-hover:text-brand transition-colors">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-deep/50 truncate">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2: Android App Installation & Permissions */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-deep/40 px-1">
            Android Features & System
          </span>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInstall();
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-brand/15 to-gold/15 border border-brand/30 flex items-center justify-between gap-3 text-left hover:scale-[1.01] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-brand text-primary-foreground grid place-items-center shrink-0 shadow-xs">
                  <Download className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-deep">Download Shareek APK</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full bg-brand text-primary-foreground">
                      v1.0.0 · 5.3 MB
                    </span>
                  </div>
                  <p className="text-[11px] text-deep/60 mt-0.5">
                    Native standalone Android build with deep app blocking & background Adhan
                  </p>
                </div>
              </div>
              <ChevronRight className="size-4 text-brand shrink-0" />
            </button>

            <Link
              to="/pray-first"
              onClick={onClose}
              className="w-full p-3 rounded-2xl bg-panel border border-hairline flex items-center justify-between gap-3 text-left hover:border-brand/30 transition no-underline"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0">
                  <Shield className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-deep block">
                    Khushūʿ Shield Permissions & Settings
                  </span>
                  <span className="text-[11px] text-deep/50">
                    Overlay display, battery optimization & app distraction blocking
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-deep/40 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Section 3: Contribute & About */}
        <div className="pt-2 border-t border-hairline flex items-center justify-between gap-2 text-xs">
          <Link
            to="/contribute"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-brand/10 text-brand font-semibold hover:bg-brand/15 transition text-center no-underline flex items-center justify-center gap-1.5"
          >
            <span>💚 Contribute (Sadaqah)</span>
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-panel border border-hairline text-deep/70 font-semibold hover:bg-mist transition text-center no-underline"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
