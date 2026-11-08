import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Trash2,
  Download,
  Smartphone,
  Sparkles,
  Info,
  Clock,
  Lock,
} from "lucide-react";
import {
  type PrayFirstConfig,
  type BlockableApp,
  loadPrayFirstConfig,
  savePrayFirstConfig,
  PRESET_APPS,
  ADHAN_OPTIONS,
} from "@/data/prayFirst";
import { KhushuuLockOverlay } from "@/components/KhushuuLockOverlay";
import { AndroidPermissionsCard } from "@/components/AndroidPermissionsCard";
import { PRAYER_ORDER, PRAYER_LABELS } from "@/lib/prayer-times";

export const Route = createFileRoute("/pray-first")({
  head: () => ({
    meta: [
      { title: "Pray First (صلّ أولاً) — Khushūʿ Shield & Distraction Blocker | Shareek" },
      {
        name: "description",
        content:
          "Block distracting apps during prayer times, enable automated Adhan alerts, and protect your khushu with Shareek's Pray First shield.",
      },
      { property: "og:title", content: "Pray First — Khushūʿ Shield | Shareek" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrayFirstPage,
});

function PrayFirstPage() {
  const [config, setConfig] = useState<PrayFirstConfig>(loadPrayFirstConfig);
  const [testOverlayOpen, setTestOverlayOpen] = useState(false);
  const [previewingAdhanId, setPreviewingAdhanId] = useState<string | null>(null);
  const [newAppName, setNewAppName] = useState("");
  const [newAppPkg, setNewAppPkg] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const updateConfig = (updater: (prev: PrayFirstConfig) => PrayFirstConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      savePrayFirstConfig(next);
      return next;
    });
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const toggleAppBlocked = (id: string) => {
    updateConfig((prev) => {
      const isBlocked = prev.blockedAppIds.includes(id);
      return {
        ...prev,
        blockedAppIds: isBlocked
          ? prev.blockedAppIds.filter((x) => x !== id)
          : [...prev.blockedAppIds, id],
      };
    });
  };

  const selectAllApps = () => {
    updateConfig((prev) => ({
      ...prev,
      blockedAppIds: [
        ...PRESET_APPS.map((a) => a.id),
        ...(prev.customApps || []).map((a) => a.id),
      ],
    }));
  };

  const deselectAllApps = () => {
    updateConfig((prev) => ({
      ...prev,
      blockedAppIds: [],
    }));
  };

  const handlePreviewAdhan = (id: string, url: string) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }

    if (previewingAdhanId === id) {
      setPreviewingAdhanId(null);
      return;
    }

    const audio = new Audio(url);
    previewAudioRef.current = audio;
    setPreviewingAdhanId(id);
    audio.play().catch(() => {});
    audio.onended = () => setPreviewingAdhanId(null);
  };

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: BlockableApp = {
      id: `custom_${Date.now()}`,
      name: newAppName.trim(),
      category: "custom",
      packageName: newAppPkg.trim() || `app.${newAppName.toLowerCase().replace(/\s+/g, "")}`,
      icon: "📱",
      defaultBlocked: true,
    };

    updateConfig((prev) => ({
      ...prev,
      customApps: [...(prev.customApps || []), newApp],
      blockedAppIds: [...prev.blockedAppIds, newApp.id],
    }));

    setNewAppName("");
    setNewAppPkg("");
    setShowAddModal(false);
  };

  const handleRemoveCustomApp = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      customApps: (prev.customApps || []).filter((a) => a.id !== id),
      blockedAppIds: prev.blockedAppIds.filter((x) => x !== id),
    }));
  };

  const allApps = [...PRESET_APPS, ...(config.customApps || [])];

  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20"
    >
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-2">
            <Shield className="size-3.5" />
            <span>Sacred Focus &amp; Mobile Discipline · صَلِّ أَوَّلًا</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-deep tracking-tight">
            Pray First · Khushūʿ Shield
          </h1>
          <p className="mt-1.5 text-sm text-deep/65 max-w-xl leading-relaxed">
            Automatically silence distracting reels, social feeds, and notifications when prayer
            time enters. Elevate your presence of heart (Khushūʿ) before reaching for your phone.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedBadge && (
            <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => setTestOverlayOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand text-primary-foreground text-xs sm:text-sm font-semibold shadow-md shadow-brand/20 hover:bg-deep transition cursor-pointer"
          >
            <ShieldAlert className="size-4" />
            <span>Test Shield Overlay</span>
          </button>
        </div>
      </div>

      {/* Android System Permissions & Background Service Setup */}
      <div className="mt-8">
        <AndroidPermissionsCard prayerName="Upcoming Salah" />
      </div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        {/* Left Column: Shield Master Controls & Adhan */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Shield Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-hairline">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl grid place-items-center transition-colors ${
                    config.shieldEnabled ? "bg-brand text-primary-foreground" : "bg-mist text-deep/40"
                  }`}
                >
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-deep">
                    Prayer Shield Active
                  </h2>
                  <p className="text-xs text-deep/60">
                    {config.shieldEnabled
                      ? "Lockdown will activate at each Adhan time"
                      : "Shield is currently paused"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({ ...prev, shieldEnabled: !prev.shieldEnabled }))
                }
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.shieldEnabled ? "bg-brand" : "bg-mist"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    config.shieldEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Timers & Buffer settings */}
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-panel/80 border border-hairline">
                <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-brand" />
                  Pre-Adhan Warning
                </label>
                <select
                  value={config.prePrayerBufferMinutes}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      prePrayerBufferMinutes: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-mist/60 border border-hairline rounded-xl px-3 py-2 text-xs font-semibold text-deep focus:outline-none focus:border-brand cursor-pointer"
                >
                  <option value={0}>Disabled (At exact Adhan)</option>
                  <option value={3}>3 minutes before Adhan</option>
                  <option value={5}>5 minutes before Adhan (Recommended)</option>
                  <option value={10}>10 minutes before Adhan</option>
                </select>
                <p className="mt-1.5 text-[11px] text-deep/50">
                  Gives you time to finish work and prepare for Wudu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-panel/80 border border-hairline">
                <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-brand" />
                  Shield Lock Duration
                </label>
                <select
                  value={config.lockdownDurationMinutes}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      lockdownDurationMinutes: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-mist/60 border border-hairline rounded-xl px-3 py-2 text-xs font-semibold text-deep focus:outline-none focus:border-brand cursor-pointer"
                >
                  <option value={10}>10 minutes after Adhan</option>
                  <option value={15}>15 minutes after Adhan</option>
                  <option value={20}>20 minutes after Adhan (Standard)</option>
                  <option value={30}>30 minutes after Adhan (Strict)</option>
                </select>
                <p className="mt-1.5 text-[11px] text-deep/50">
                  Covers Sunnah prayers and post-salah adhkar.
                </p>
              </div>
            </div>
          </div>

          {/* Adhan Voice & Per-Prayer Alerts */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand grid place-items-center">
                  <Volume2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-semibold text-deep">
                    Adhan Audio Calling
                  </h3>
                  <p className="text-xs text-deep/60">
                    Play the authentic Azan aloud when prayer enters
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateConfig((prev) => ({ ...prev, adhanEnabled: !prev.adhanEnabled }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.adhanEnabled ? "bg-brand" : "bg-mist"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    config.adhanEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Select Voice */}
            <div className="mt-4 space-y-2.5">
              <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider">
                Select Muadhin / Style
              </label>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {ADHAN_OPTIONS.map((adhan) => {
                  const isSelected = config.selectedAdhan === adhan.id;
                  const isPreviewing = previewingAdhanId === adhan.id;
                  return (
                    <div
                      key={adhan.id}
                      onClick={() =>
                        updateConfig((prev) => ({ ...prev, selectedAdhan: adhan.id }))
                      }
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-brand/10 border-brand/50 text-brand font-semibold shadow-xs"
                          : "bg-panel/70 border-hairline text-deep hover:bg-panel"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{adhan.name}</p>
                        <p className="text-[10px] text-deep/55 truncate">{adhan.location}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewAdhan(adhan.id, adhan.audioUrl);
                        }}
                        className="p-1.5 rounded-lg bg-panel hover:bg-mist text-deep/70 hover:text-brand border border-hairline shrink-0"
                        title={isPreviewing ? "Pause Preview" : "Listen Preview"}
                      >
                        {isPreviewing ? (
                          <Pause className="size-3.5 text-brand" />
                        ) : (
                          <Play className="size-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-Prayer Toggles */}
            <div className="mt-5 pt-4 border-t border-hairline">
              <label className="block text-xs font-semibold text-deep/70 uppercase tracking-wider mb-2.5">
                Active For Each Prayer
              </label>
              <div className="grid grid-cols-5 gap-2 text-center">
                {PRAYER_ORDER.filter((k) => k !== "sunrise").map((key) => {
                  const active = config.perPrayerAdhan?.[key] !== false;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          perPrayerAdhan: {
                            ...(prev.perPrayerAdhan || {}),
                            [key]: !active,
                          },
                        }))
                      }
                      className={`p-2.5 rounded-2xl border text-xs font-medium transition cursor-pointer ${
                        active
                          ? "bg-brand text-primary-foreground font-semibold shadow-xs"
                          : "bg-mist/70 border-hairline text-deep/50 hover:bg-mist"
                      }`}
                    >
                      <span className="block font-semibold capitalize">{PRAYER_LABELS[key]}</span>
                      <span className="block text-[10px] opacity-80 mt-0.5">
                        {active ? "On" : "Off"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Blocked Apps Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-base font-display font-semibold text-deep">
                  Distracting Apps to Shield
                </h3>
                <p className="text-xs text-deep/60">
                  {config.blockedAppIds.length} apps currently restricted
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllApps}
                  className="text-[11px] font-semibold text-brand hover:text-deep transition"
                >
                  Select All
                </button>
                <span className="text-deep/20">·</span>
                <button
                  type="button"
                  onClick={deselectAllApps}
                  className="text-[11px] font-semibold text-deep/50 hover:text-deep transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Apps List */}
            <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {allApps.map((app) => {
                const isBlocked = config.blockedAppIds.includes(app.id);
                return (
                  <div
                    key={app.id}
                    onClick={() => toggleAppBlocked(app.id)}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isBlocked
                        ? "bg-rose-50/60 border-rose-200 text-deep"
                        : "bg-panel/70 border-hairline text-deep/50 hover:bg-panel"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl w-8 h-8 rounded-xl bg-white shadow-2xs grid place-items-center shrink-0">
                        {app.icon}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isBlocked ? "text-deep" : "text-deep/60"
                          }`}
                        >
                          {app.name}
                        </p>
                        <p className="text-[10px] text-deep/45 truncate font-mono">
                          {app.packageName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.category === "custom" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomApp(app.id);
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-100"
                          title="Remove custom app"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                      <span
                        className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                          isBlocked
                            ? "bg-rose-100/80 text-rose-700 border-rose-300"
                            : "bg-mist text-deep/40 border-hairline"
                        }`}
                      >
                        {isBlocked ? "Shielded" : "Allowed"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom App Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-4 w-full py-2.5 px-4 rounded-2xl border border-dashed border-hairline hover:border-brand/40 bg-panel/50 hover:bg-panel text-xs font-semibold text-deep/75 hover:text-brand flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Custom App to Shield</span>
            </button>
          </div>

          {/* Android Native APK Card */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-brand/10 to-transparent border border-brand/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand text-primary-foreground grid place-items-center shrink-0">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-deep">
                  System-Level App Blocking with Shareek APK
                </h4>
                <p className="mt-1 text-xs text-deep/65 leading-relaxed">
                  Web browsers cannot close other apps due to sandbox security. Download the
                  native <strong>Shareek Android APK</strong> which uses the Accessibility
                  Service to automatically block shielded apps during Salah times.
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <a
                    href="https://github.com/nafihcc/faiz-sanctuary/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand text-primary-foreground text-xs font-semibold shadow-xs hover:bg-deep transition no-underline"
                  >
                    <Download className="size-3.5" />
                    <span>Download Shareek APK</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom App Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-panel border border-hairline p-6 shadow-2xl">
            <h3 className="text-lg font-display font-semibold text-deep">
              Add Custom Distraction App
            </h3>
            <p className="mt-1 text-xs text-deep/60">
              Enter the app name and optional Android package identifier.
            </p>

            <form onSubmit={handleAddCustomApp} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-deep/70 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Candy Crush, Pinterest"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full rounded-xl bg-mist/60 border border-hairline px-3.5 py-2.5 text-xs text-deep focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-deep/70 mb-1">
                  Package Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. com.king.candycrushsaga"
                  value={newAppPkg}
                  onChange={(e) => setNewAppPkg(e.target.value)}
                  className="w-full rounded-xl bg-mist/60 border border-hairline px-3.5 py-2.5 text-xs font-mono text-deep focus:outline-none focus:border-brand"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-hairline text-xs font-semibold text-deep/60 hover:bg-mist"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-brand text-primary-foreground text-xs font-semibold shadow-xs hover:bg-deep"
                >
                  Add to Shield
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Overlay Preview */}
      <KhushuuLockOverlay
        isOpen={testOverlayOpen}
        onClose={() => setTestOverlayOpen(false)}
        prayerName="Asr (Test Mode)"
        isTestMode={true}
      />
    </motion.main>
  );
}
