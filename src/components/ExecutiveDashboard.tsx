import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Compass,
  BookOpen,
  MapPin,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Download,
  Smartphone,
  Play,
  RotateCcw,
  Clock,
  Navigation,
} from "lucide-react";
import { useLocationSettings } from "@/context/location";
import { usePrayerTimes, useHijriDate } from "@/hooks/usePrayerTimes";
import {
  PRAYER_LABELS,
  PRAYER_ORDER,
  formatCountdown,
  formatTime,
  prayerBasis,
  type PrayerKey,
} from "@/lib/prayer-times";
import { qiblaBearing } from "@/lib/qibla";
import {
  loadPrayFirstConfig,
  savePrayFirstConfig,
  type PrayFirstConfig,
  PRESET_APPS,
} from "@/data/prayFirst";
import { KhushuuLockOverlay } from "@/components/KhushuuLockOverlay";

const PRAYER_ARABIC: Record<PrayerKey, string> = {
  fajr: "الفَجْر",
  sunrise: "الشُّرُوق",
  dhuhr: "الظُّهْر",
  asr: "العَصْر",
  maghrib: "المَغْرِب",
  isha: "العِشَاء",
};

export function ExecutiveDashboard({ onOpenLocation }: { onOpenLocation: () => void }) {
  const { location, settings, isDefault } = useLocationSettings();
  const { result, next, now } = usePrayerTimes();
  const hijri = useHijriDate(now);
  const bearing = qiblaBearing(location.latitude, location.longitude);

  // Pray First configuration state
  const [prayConfig, setPrayConfig] = useState<PrayFirstConfig>(loadPrayFirstConfig);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleShieldMaster = () => {
    const updated: PrayFirstConfig = { ...prayConfig, isEnabled: !prayConfig.isEnabled };
    setPrayConfig(updated);
    savePrayFirstConfig(updated);
  };

  const toggleAdhanMaster = () => {
    const updated: PrayFirstConfig = {
      ...prayConfig,
      adhanEnabled: !prayConfig.adhanEnabled,
    };
    setPrayConfig(updated);
    savePrayFirstConfig(updated);
  };

  // Celestial solar arc computation
  const solarArcMetrics = useMemo(() => {
    if (!result) return { progress: 0.5, sunElevation: 45, phase: "Day" };
    const fajrTime = result.times.fajr.getTime();
    const ishaTime = result.times.isha.getTime();
    const nowTime = now.getTime();
    const span = Math.max(1, ishaTime - fajrTime);
    const raw = (nowTime - fajrTime) / span;
    const progress = Math.min(Math.max(raw, 0), 1);

    // Approximate solar elevation angle (0 at horizon, ~70-90 at zenith)
    const mid = (fajrTime + ishaTime) / 2;
    const distFromNoon = Math.abs(nowTime - mid) / (span / 2);
    const sunElevation = Math.max(-18, Math.round(75 * (1 - Math.min(distFromNoon, 1.2))));

    let phase = "Solar Transit";
    if (nowTime < fajrTime) phase = "Night / Tahajjud";
    else if (nowTime < result.times.sunrise.getTime()) phase = "Dawn Twilight (Fajr)";
    else if (nowTime < result.times.dhuhr.getTime()) phase = "Forenoon (Duha)";
    else if (nowTime < result.times.asr.getTime()) phase = "Midday (Dhuhr)";
    else if (nowTime < result.times.maghrib.getTime()) phase = "Afternoon (Asr)";
    else if (nowTime < ishaTime) phase = "Dusk Twilight (Maghrib)";
    else phase = "Night (Isha)";

    return { progress, sunElevation, phase };
  }, [result, now]);

  const activeBlockedApps = PRESET_APPS.filter((a) =>
    prayConfig.blockedAppIds.includes(a.id)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Executive Telemetry Strip */}
      <section className="glass-panel rounded-3xl p-5 sm:p-7 border border-hairline/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep/5 border border-hairline text-xs font-semibold text-deep/80 tracking-wide uppercase">
              <span className="size-2 rounded-full bg-brand animate-pulse" />
              <span>Studio Workstation</span>
            </div>
            <span className="text-xs text-deep/40 font-mono hidden sm:inline">
              ASTRO-NAV v2.4
            </span>
            <span className="text-xs font-medium text-deep/60 px-2.5 py-1 rounded-md bg-mist/60 border border-hairline/50">
              {hijri || "Islamic Calendar"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-deep/70">
            <div className="flex items-center gap-1.5 bg-panel px-3 py-1.5 rounded-xl border border-hairline">
              <Compass className="size-3.5 text-brand" />
              <span>
                {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-panel px-3 py-1.5 rounded-xl border border-hairline">
              <Navigation className="size-3.5 text-gold" />
              <span>Qibla {bearing.toFixed(1)}°</span>
            </div>
            <button
              onClick={onOpenLocation}
              className="text-xs font-semibold text-brand hover:text-deep hover:underline transition px-2 py-1"
            >
              {location.name} ({Math.round(location.elevation)}m) ✎
            </button>
          </div>
        </div>
      </section>

      {/* 2. Master Solar Horizon & High-Contrast Next Prayer HUD */}
      <section className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Next Prayer Executive Deck */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-hairline/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono tracking-widest uppercase text-deep/40 font-bold">
                  01 // CURRENT HORIZON
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                  {solarArcMetrics.phase}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono text-deep/60 tabular-nums">
                  {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-deep/50 font-semibold font-mono">
                  Approaching Obligation
                </p>
                <div className="mt-1 flex items-baseline gap-3">
                  <h2 className="text-4xl sm:text-5xl font-display font-semibold text-deep tracking-tight">
                    {next ? PRAYER_LABELS[next.key] : "—"}
                  </h2>
                  <span className="text-2xl sm:text-3xl font-arabic text-brand/80 font-normal">
                    {next ? PRAYER_ARABIC[next.key] : ""}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-3xl sm:text-4xl font-display font-semibold text-deep tabular-nums tracking-tight">
                  {next ? formatTime(next.at) : "--:--"}
                </p>
                <p className="text-xs font-mono font-medium text-brand mt-0.5 tabular-nums">
                  {next ? `T-minus ${formatCountdown(next.msRemaining)}` : "Computing orbital path..."}
                </p>
              </div>
            </div>

            {/* Precision Celestial Progress Rail */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-deep/50">
                <span>Phase Progress</span>
                <span className="tabular-nums">
                  {Math.round((next?.progress ?? 0) * 100)}% Elapsed
                </span>
              </div>
              <div className="h-2 rounded-full bg-mist/80 p-0.5 overflow-hidden border border-hairline/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((next?.progress ?? 0) * 100)}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-brand via-brand/90 to-deep"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-hairline/80 flex flex-wrap items-center justify-between gap-4 text-xs text-deep/60">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="size-1.5 rounded-full bg-brand" />
                Fajr {settings.fajrAngle}° · Isha {settings.ishaAngle}°
              </span>
              <span className="hidden sm:inline text-hairline">|</span>
              <span className="hidden sm:inline font-mono">
                {result ? result.horizonDipDegrees.toFixed(2) : "0.00"}° Horizon Dip
              </span>
            </div>

            <Link
              to="/methodology"
              className="text-xs font-semibold text-brand hover:text-deep transition flex items-center gap-1 no-underline"
            >
              Methodology Specifications
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Khushūʿ Shield Focus & Mobile Distraction Lock Hub */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-hairline/90 shadow-sm relative overflow-hidden bg-gradient-to-b from-panel to-panel/70">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-brand">
                <Shield className="size-4" />
                <span>Pray First · Khushūʿ Shield</span>
              </div>
              <span
                className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                  prayConfig.isEnabled
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-deep/10 text-deep/50"
                }`}
              >
                {prayConfig.isEnabled ? "Shield Active" : "Shield Paused"}
              </span>
            </div>

            <h3 className="mt-4 text-xl sm:text-2xl font-display font-semibold text-deep">
              Guard your prayer from mobile distraction.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-deep/60 leading-relaxed">
              Automates full Adhan alerts at prayer time and blocks distracting apps (Instagram, YouTube,
              TikTok, WhatsApp) during Salah.
            </p>

            {/* Quick Control Matrix */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={toggleShieldMaster}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  prayConfig.isEnabled
                    ? "bg-brand/10 border-brand/40 text-brand"
                    : "bg-panel border-hairline text-deep/60 hover:bg-mist"
                }`}
              >
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-deep/50">
                    App Blocker
                  </span>
                  <span className="text-xs font-semibold text-deep mt-0.5 block">
                    {prayConfig.isEnabled ? "Armed (Guarding)" : "Disarmed"}
                  </span>
                </div>
                {prayConfig.isEnabled ? (
                  <ShieldCheck className="size-5 text-brand shrink-0" />
                ) : (
                  <ShieldAlert className="size-5 text-deep/40 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={toggleAdhanMaster}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  prayConfig.adhanEnabled
                    ? "bg-brand/10 border-brand/40 text-brand"
                    : "bg-panel border-hairline text-deep/60 hover:bg-mist"
                }`}
              >
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-deep/50">
                    Auto Adhan
                  </span>
                  <span className="text-xs font-semibold text-deep mt-0.5 block">
                    {prayConfig.adhanEnabled ? "Audible Alert" : "Silent"}
                  </span>
                </div>
                {prayConfig.adhanEnabled ? (
                  <Volume2 className="size-5 text-brand shrink-0" />
                ) : (
                  <VolumeX className="size-5 text-deep/40 shrink-0" />
                )}
              </button>
            </div>

            {/* Shielded Apps Visual Dock */}
            <div className="mt-4 pt-3 border-t border-hairline/60">
              <div className="flex items-center justify-between text-xs text-deep/60 mb-2 font-mono">
                <span>Shielded Distractions ({prayConfig.blockedAppIds.length})</span>
                <span className="text-[11px] text-brand font-sans">
                  {prayConfig.lockdownDurationMinutes} min lockdown
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeBlockedApps.slice(0, 5).map((app) => (
                  <span
                    key={app.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-panel border border-hairline text-[11px] text-deep/80"
                  >
                    <span>{app.icon}</span>
                    <span className="font-medium">{app.name}</span>
                  </span>
                ))}
                {activeBlockedApps.length > 5 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-xl bg-panel text-[11px] text-deep/50 font-mono">
                    +{activeBlockedApps.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsOverlayOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm hover:bg-deep transition cursor-pointer"
            >
              <Play className="size-3.5 fill-current" />
              <span>Preview Khushūʿ Lock</span>
            </button>

            <Link
              to="/pray-first"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-panel border border-hairline text-deep text-xs font-semibold hover:bg-mist transition no-underline"
            >
              <span>Configure Shield</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Executive 6-Phase Daily Prayer Table */}
      <section className="glass-panel rounded-3xl overflow-hidden border border-hairline shadow-sm">
        <div className="px-6 sm:px-8 py-5 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-panel/60">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">
              02 // DIURNAL TIMELINE
            </span>
            <h3 className="text-xl font-display font-semibold text-deep">
              Astronomical Prayer Sequence for {location.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-deep/50 font-mono">Elevation: {Math.round(location.elevation)}m</span>
            <span className="size-1 rounded-full bg-deep/30" />
            <span className="text-xs text-deep/50 font-mono">Maghrib Lag: {result?.maghribLagMinutes ?? 4}m</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-hairline">
          {PRAYER_ORDER.map((key) => {
            const isNext = next?.key === key;
            const prayerTime = result?.times[key];
            const hasPassed = prayerTime ? prayerTime.getTime() < now.getTime() : false;

            return (
              <div
                key={key}
                className={`p-5 flex flex-col justify-between transition-colors ${
                  isNext
                    ? "bg-brand/[0.08] ring-1 ring-inset ring-brand/30"
                    : hasPassed
                    ? "opacity-60 bg-transparent"
                    : "bg-transparent hover:bg-mist/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-deep/50 font-semibold">
                      {key}
                    </span>
                    {isNext && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-brand text-primary-foreground">
                        NEXT
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-2xl font-display font-semibold text-deep tabular-nums">
                    {result ? formatTime(result.times[key]) : "--:--"}
                  </p>
                  <p className="mt-0.5 text-xs text-deep/70 font-arabic">
                    {PRAYER_ARABIC[key]}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline/60">
                  <p className="text-[11px] text-deep/50 leading-snug line-clamp-2">
                    {prayerBasis(key, settings)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Complete Sanctum Suite: 8 Dedicated Islamic Workstation Modules */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">
              03 // SANCTUM WORKSPACE
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-deep">
              Primary Islamic Utilities
            </h3>
          </div>
          <span className="text-xs text-deep/40 font-mono">8 Integrated Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              to: "/quran",
              title: "Noble Quran",
              sub: "114 Surahs, Mushaf & audio recitation",
              icon: "📖",
              tag: "Mushaf · Audio",
              badge: "Complete Text",
            },
            {
              to: "/masjid",
              title: "Masajid Radar",
              sub: "Proximity finder & congregation times",
              icon: "🕌",
              tag: "Spatial · Map",
              badge: "Nearby",
            },
            {
              to: "/asmaul-husna",
              title: "99 Divine Names",
              sub: "Al-Asmāʾ al-Ḥusnā with meanings & audio",
              icon: "✨",
              tag: "Names · Audio",
              badge: "Authentic",
            },
            {
              to: "/duas",
              title: "Adhkar & Supplications",
              sub: "Sunnah prayers from Hisn al-Muslim",
              icon: "🤲",
              tag: "Hisn al-Muslim",
              badge: "Sunnah",
            },
            {
              to: "/qibla",
              title: "Qibla Compass",
              sub: "AR compass & precise Ka'bah bearing",
              icon: "🧭",
              tag: "AR · Bearing",
              badge: `${bearing.toFixed(1)}° Bearing`,
            },
            {
              to: "/dhikr",
              title: "Digital Tasbeeh",
              sub: "Haptic tally counter with custom goals",
              icon: "📿",
              tag: "Tally · Counter",
              badge: "Tasbeeh",
            },
            {
              to: "/tracker",
              title: "Worship Tracker",
              sub: "5 daily prayers & Nawafil accountability",
              icon: "📊",
              tag: "Salah · Nawafil",
              badge: "Accountability",
            },
            {
              to: "/calendar",
              title: "Hijri Timetable",
              sub: "Monthly astronomical solar calendar",
              icon: "🗓️",
              tag: "Monthly · Export",
              badge: "Full Month",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="glass-panel group block rounded-3xl p-5 border border-hairline/80 shadow-2xs hover:shadow-lg hover:border-brand/40 transition-all no-underline"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2.5 rounded-2xl bg-panel border border-hairline/60 group-hover:scale-105 transition-transform">
                  {item.icon}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-deep/5 text-deep/60">
                  {item.badge}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-deep font-display group-hover:text-brand transition-colors">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-deep/60 leading-relaxed">
                  {item.sub}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center justify-between text-xs text-deep/50 font-mono">
                <span>{item.tag}</span>
                <ArrowUpRight className="size-3.5 text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Native Android APK & Mobile Focus Banner */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-hairline/80 shadow-xs bg-gradient-to-r from-panel via-panel to-brand/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-mono font-semibold">
              <Smartphone className="size-3.5" />
              <span>Native Android APK Package</span>
            </div>
            <h3 className="mt-3 text-2xl font-display font-semibold text-deep">
              Deploy Shareek natively on your Android device.
            </h3>
            <p className="mt-2 text-sm text-deep/60 leading-relaxed">
              Install the standalone `.apk` directly to enable full background Adhan audio notifications
              and the real Khushūʿ app-blocking service when prayer time begins.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="https://github.com/nafihcc/faiz-sanctuary/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand text-primary-foreground text-xs font-semibold px-5 py-3 rounded-full shadow-md shadow-brand/20 hover:bg-deep transition cursor-pointer no-underline"
            >
              <Download className="size-4" />
              <span>Download Shareek.apk</span>
            </a>
            <Link
              to="/pray-first"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-panel border border-hairline text-deep text-xs font-semibold hover:bg-mist transition no-underline"
            >
              <Shield className="size-4 text-brand" />
              <span>Configure Pray First</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Khushūʿ Screen Overlay Preview Modal */}
      <KhushuuLockOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        prayerName={next ? PRAYER_LABELS[next.key] : "Dhuhr"}
        isTestMode={true}
      />
    </div>
  );
}
