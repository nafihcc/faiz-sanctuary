import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
  Lock,
} from "lucide-react";
import {
  type PrayFirstConfig,
  type BlockableApp,
  loadPrayFirstConfig,
  PRESET_APPS,
  ADHAN_OPTIONS,
} from "@/data/prayFirst";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { PRAYER_LABELS } from "@/lib/prayer-times";
import { ShareekLogo } from "@/components/ShareekLogo";

interface KhushuuLockOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  prayerName?: string;
  isTestMode?: boolean;
}

export function KhushuuLockOverlay({
  isOpen,
  onClose,
  prayerName = "Current Salah",
  isTestMode = false,
}: KhushuuLockOverlayProps) {
  const [config, setConfig] = useState<PrayFirstConfig>(loadPrayFirstConfig);
  const [secondsRemaining, setSecondsRemaining] = useState(
    config.lockdownDurationMinutes * 60
  );
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [showBypassConfirm, setShowBypassConfirm] = useState(false);
  const [bypassCountdown, setBypassCountdown] = useState(10);
  const [hasPrayed, setHasPrayed] = useState(false);

  const { next } = usePrayerTimes();
  const currentPrayerLabel =
    prayerName && prayerName !== "Current Salah"
      ? prayerName
      : next
      ? PRAYER_LABELS[next.key]
      : "Salah";

  // Reload config when overlay opens
  useEffect(() => {
    if (isOpen) {
      const cfg = loadPrayFirstConfig();
      setConfig(cfg);
      setSecondsRemaining(cfg.lockdownDurationMinutes * 60);
      setHasPrayed(false);
      setShowBypassConfirm(false);
      setBypassCountdown(10);

      // Play adhan if enabled
      if (cfg.adhanEnabled) {
        const adhan = ADHAN_OPTIONS.find((a) => a.id === cfg.selectedAdhan);
        if (adhan) {
          const audio = new Audio(adhan.audioUrl);
          audio.volume = 0.85;
          audio
            .play()
            .then(() => setIsPlayingAdhan(true))
            .catch(() => {
              // Browser may block autoplay without prior user interaction
            });
          setAudioEl(audio);
        }
      }
    } else {
      if (audioEl) {
        audioEl.pause();
        audioEl.currentTime = 0;
      }
      setIsPlayingAdhan(false);
    }
    return () => {
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, secondsRemaining]);

  // Bypass countdown
  useEffect(() => {
    if (!showBypassConfirm || bypassCountdown <= 0) return;
    const interval = setInterval(() => {
      setBypassCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showBypassConfirm, bypassCountdown]);

  const toggleAdhanAudio = () => {
    if (!audioEl) {
      const adhan = ADHAN_OPTIONS.find((a) => a.id === config.selectedAdhan);
      if (adhan) {
        const audio = new Audio(adhan.audioUrl);
        audio.play().then(() => setIsPlayingAdhan(true));
        setAudioEl(audio);
      }
      return;
    }
    if (isPlayingAdhan) {
      audioEl.pause();
      setIsPlayingAdhan(false);
    } else {
      audioEl.play();
      setIsPlayingAdhan(true);
    }
  };

  const handlePrayedConfirmation = () => {
    setHasPrayed(true);
    // Mark in daily tracker if needed
    try {
      const today = new Date().toISOString().split("T")[0];
      const trackerKey = "shareek.tracker";
      const existing = JSON.parse(localStorage.getItem(trackerKey) || "{}");
      existing[today] = {
        ...(existing[today] || {}),
        swalat: (existing[today]?.swalat || 0) + 1,
      };
      localStorage.setItem(trackerKey, JSON.stringify(existing));
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (audioEl) audioEl.pause();
      onClose();
    }, 1200);
  };

  const handleEmergencyBypass = () => {
    if (audioEl) audioEl.pause();
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Blocked apps list
  const activeBlockedApps: BlockableApp[] = [
    ...PRESET_APPS.filter((a) => config.blockedAppIds.includes(a.id)),
    ...(config.customApps || []),
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl text-white select-none overflow-y-auto"
      >
        {/* Subtle Sacred Geometry Watermark */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          className="relative w-full max-w-xl my-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <ShareekLogo className="size-9" />
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5" />
                  Khushūʿ Shield · حارس الخشوع
                </span>
                <p className="text-xs text-slate-400">Pray First, Phone Later</p>
              </div>
            </div>

            {isTestMode && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                title="Close Preview"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Central Call to Prayer Message */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              <Sparkles className="size-3.5" />
              <span>Time for {currentPrayerLabel} Prayer</span>
            </div>

            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold tracking-tight text-white">
              صَلِّ أَوَّلًا ثُمَّ اسْتَخْدِمْ هَاتِفَكَ
            </h2>
            <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-200">
              Pray First. Your Lord Deserves Your Time.
            </p>

            {/* Countdown Clock */}
            <div className="mt-5 inline-flex flex-col items-center p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider">
                <Clock className="size-3.5 text-emerald-400" />
                <span>Focus Shield Lockdown Timer</span>
              </div>
              <span className="mt-1 text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white tabular-nums">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Remaining until phone unlocks automatically
              </span>
            </div>
          </div>

          {/* Adhan Audio Controller */}
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center">
                {isPlayingAdhan ? (
                  <Volume2 className="size-4 animate-pulse" />
                ) : (
                  <VolumeX className="size-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Adhan · {config.selectedAdhan.toUpperCase()}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isPlayingAdhan ? "Playing call to prayer..." : "Muted"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAdhanAudio}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white transition cursor-pointer"
            >
              {isPlayingAdhan ? "Mute Adhan" : "Play Adhan"}
            </button>
          </div>

          {/* Shielded Apps Visual List */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="size-3 text-rose-400" />
                Distractions Shielded ({activeBlockedApps.length} Apps)
              </span>
              <span className="text-[10px] text-rose-400 font-mono">Blocked</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {activeBlockedApps.map((app) => (
                <span
                  key={app.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300"
                >
                  <span>{app.icon}</span>
                  <span>{app.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Quranic Reminder */}
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-center">
            <p className="font-arabic text-base sm:text-lg text-emerald-200" dir="rtl">
              حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ
            </p>
            <p className="mt-1 text-xs text-emerald-300/80 italic">
              “Maintain with care the [obligatory] prayers and [in particular] the middle prayer and
              stand before Allah in devout obedience.” — (Al-Baqarah 2:238)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handlePrayedConfirmation}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="size-4" />
              <span>{hasPrayed ? "Barakallahu Feek! Unlocking..." : "I Have Prayed (Unlock)"}</span>
            </button>

            {!showBypassConfirm ? (
              <button
                type="button"
                onClick={() => setShowBypassConfirm(true)}
                className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Emergency Access
              </button>
            ) : (
              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={bypassCountdown > 0}
                  onClick={handleEmergencyBypass}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition ${
                    bypassCountdown > 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                  }`}
                >
                  <AlertTriangle className="size-3.5 inline mr-1" />
                  {bypassCountdown > 0 ? `Reflect (${bypassCountdown}s)` : "Confirm Bypass"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBypassConfirm(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
