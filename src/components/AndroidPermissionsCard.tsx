import { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Eye,
  Activity,
  BatteryCharging,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { KhushuuNative, type ShieldPermissionsStatus } from "@/lib/khushuu-native";

export function AndroidPermissionsCard({
  prayerName = "Salah",
  onArmStateChange,
}: {
  prayerName?: string;
  onArmStateChange?: (armed: boolean) => void;
}) {
  const [status, setStatus] = useState<ShieldPermissionsStatus>({
    hasOverlay: false,
    hasUsageStats: false,
    isBatteryIgnored: false,
    hasNotifications: false,
    allGranted: false,
  });
  const [checking, setChecking] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [isNative] = useState(() => KhushuuNative.isNative());

  const check = async () => {
    setChecking(true);
    try {
      const s = await KhushuuNative.checkPermissions();
      setStatus(s);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void check();
    const onFocus = () => void check();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleToggleArm = async () => {
    if (isArmed) {
      await KhushuuNative.stopService();
      setIsArmed(false);
      onArmStateChange?.(false);
    } else {
      const ok = await KhushuuNative.startService(
        ["instagram", "tiktok", "youtube", "whatsapp", "facebook", "snapchat", "twitter"],
        20,
        prayerName
      );
      if (ok) {
        setIsArmed(true);
        onArmStateChange?.(true);
      }
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-hairline/80 shadow-xs space-y-5 bg-gradient-to-b from-panel via-panel to-brand/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-hairline">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-brand/10 border border-brand/20 grid place-items-center text-brand shrink-0">
            <Smartphone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-deep font-display">
                Android App-Blocking Permissions
              </h3>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  status.allGranted
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                }`}
              >
                {status.allGranted ? "Ready to Block" : "Permissions Required"}
              </span>
            </div>
            <p className="text-xs text-deep/60 mt-0.5">
              Required by Android OS so Shareek can detect and shield distracting apps during prayer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={check}
          disabled={checking}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-panel border border-hairline text-xs font-semibold text-deep/70 hover:text-deep hover:bg-mist transition cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${checking ? "animate-spin text-brand" : ""}`} />
          <span>Verify Status</span>
        </button>
      </div>

      {!isNative && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="leading-relaxed">
            <span className="font-semibold">Web Browser Notice: </span>
            Deep Android OS permissions (Display Over Other Apps & Usage Access) require the native{" "}
            <a
              href="https://github.com/nafihcc/faiz-sanctuary/releases/download/v1.0.0-apk/Shareek-App.apk"
              className="underline font-bold text-brand hover:text-deep"
            >
              Shareek APK
            </a>
            . Toggling permissions here lets you configure and simulate the focus shield.
          </div>
        </div>
      )}

      {/* Permission Rows */}
      <div className="space-y-3">
        {/* 1. Display Over Other Apps */}
        <div className="p-4 rounded-2xl bg-panel border border-hairline hover:border-brand/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${status.hasOverlay ? "bg-emerald-500/10 text-emerald-600" : "bg-deep/5 text-deep/60"}`}>
              <Eye className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-deep">Display Over Other Apps</span>
                {status.hasOverlay ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="size-3" /> Granted
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Permission Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-deep/60 mt-1 leading-relaxed">
                Allows Shareek to draw the Khushūʿ focus shield over distracting apps when prayer begins.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await KhushuuNative.requestOverlay();
              void check();
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              status.hasOverlay
                ? "bg-mist text-deep/70 hover:bg-mist/80"
                : "bg-brand text-primary-foreground shadow-xs hover:bg-deep"
            }`}
          >
            <span>{status.hasOverlay ? "Reconfigure" : "Grant Overlay"}</span>
            <ExternalLink className="size-3" />
          </button>
        </div>

        {/* 2. Usage Access */}
        <div className="p-4 rounded-2xl bg-panel border border-hairline hover:border-brand/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${status.hasUsageStats ? "bg-emerald-500/10 text-emerald-600" : "bg-deep/5 text-deep/60"}`}>
              <Activity className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-deep">Usage Access Permission</span>
                {status.hasUsageStats ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="size-3" /> Enabled
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-xs text-deep/60 mt-1 leading-relaxed">
                Enables Android to notify Shareek when distracting apps (Instagram, YouTube, etc.) are opened during Salah.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await KhushuuNative.requestUsageStats();
              void check();
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              status.hasUsageStats
                ? "bg-mist text-deep/70 hover:bg-mist/80"
                : "bg-brand text-primary-foreground shadow-xs hover:bg-deep"
            }`}
          >
            <span>{status.hasUsageStats ? "Reconfigure" : "Enable Access"}</span>
            <ExternalLink className="size-3" />
          </button>
        </div>

        {/* 3. Disable Battery Restrictions */}
        <div className="p-4 rounded-2xl bg-panel border border-hairline hover:border-brand/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${status.isBatteryIgnored ? "bg-emerald-500/10 text-emerald-600" : "bg-deep/5 text-deep/60"}`}>
              <BatteryCharging className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-deep">Disable Battery Restrictions</span>
                {status.isBatteryIgnored ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="size-3" /> Unrestricted
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Optimized (May Sleep)
                  </span>
                )}
              </div>
              <p className="text-xs text-deep/60 mt-1 leading-relaxed">
                Prevents Android OS from putting the Adhan alarms and focus shield to sleep when the phone is locked.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await KhushuuNative.requestBattery();
              void check();
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              status.isBatteryIgnored
                ? "bg-mist text-deep/70 hover:bg-mist/80"
                : "bg-brand text-primary-foreground shadow-xs hover:bg-deep"
            }`}
          >
            <span>{status.isBatteryIgnored ? "Configured" : "Allow Unrestricted"}</span>
            <ExternalLink className="size-3" />
          </button>
        </div>

        {/* 4. Notifications */}
        <div className="p-4 rounded-2xl bg-panel border border-hairline hover:border-brand/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl mt-0.5 ${status.hasNotifications ? "bg-emerald-500/10 text-emerald-600" : "bg-deep/5 text-deep/60"}`}>
              <Bell className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-deep">Audible Adhan & Notifications</span>
                {status.hasNotifications ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="size-3" /> Active
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    Not Granted
                  </span>
                )}
              </div>
              <p className="text-xs text-deep/60 mt-1 leading-relaxed">
                Allows Shareek to sound the authentic Adhan and display the live foreground countdown service.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await KhushuuNative.requestNotifications();
              void check();
            }}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              status.hasNotifications
                ? "bg-mist text-deep/70 hover:bg-mist/80"
                : "bg-brand text-primary-foreground shadow-xs hover:bg-deep"
            }`}
          >
            <span>{status.hasNotifications ? "Active" : "Allow Alerts"}</span>
            <ExternalLink className="size-3" />
          </button>
        </div>
      </div>

      {/* Arm Service Button */}
      <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-deep/70">
          <span className={`size-2 rounded-full ${isArmed ? "bg-emerald-500 animate-ping" : "bg-deep/30"}`} />
          <span className="font-medium">
            {isArmed
              ? `Khushūʿ Background Guard Armed (${prayerName})`
              : "Background service standing by"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleArm}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
            isArmed
              ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20"
              : "bg-brand text-primary-foreground hover:bg-deep shadow-brand/20"
          }`}
        >
          {isArmed ? (
            <>
              <ShieldAlert className="size-4" />
              <span>Disarm Shield Service</span>
            </>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              <span>Arm Khushūʿ Background Shield</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
