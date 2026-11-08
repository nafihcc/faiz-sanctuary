import { useState, useEffect } from "react";
import {
  Download,
  Smartphone,
  Shield,
  Volume2,
  Compass,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Share2,
} from "lucide-react";
import { ShareekLogo } from "@/components/ShareekLogo";

const APK_URL = "https://github.com/nafihcc/faiz-sanctuary/releases/download/v1.0.0-apk/Shareek-App.apk";

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function AndroidInstallDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPwaInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsPwaInstalled(true);
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep/40 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg glass-panel bg-panel rounded-3xl p-6 sm:p-8 border border-hairline shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-deep/60 hover:text-deep hover:bg-mist transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Header with App Identity */}
        <div className="flex items-center gap-4">
          <ShareekLogo className="size-16 shrink-0 drop-shadow-md" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-deep font-display">Shareek</h2>
              <span className="text-sm font-arabic text-brand">شَرِيك</span>
            </div>
            <p className="text-xs text-deep/60 mt-0.5">
              Sacred Timekeeper · Khushūʿ Shield
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold">
                Android APK v1.0.0
              </span>
              <span className="text-deep/40">·</span>
              <span className="text-deep/60">5.3 MB</span>
              <span className="text-deep/40">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Universal Build
              </span>
            </div>
          </div>
        </div>

        {/* Key Features Callout */}
        <div className="mt-6 p-4 rounded-2xl bg-brand/5 border border-brand/15 space-y-2.5">
          <p className="text-xs font-semibold text-brand tracking-wide uppercase font-mono">
            Why install native APK instead of website?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-deep/80">
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-brand shrink-0" />
              <span>Real App Blocker (Instagram/YT)</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="size-3.5 text-brand shrink-0" />
              <span>Background Adhan alarms</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="size-3.5 text-brand shrink-0" />
              <span>Works 100% offline</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="size-3.5 text-brand shrink-0" />
              <span>Hardware-sensor AR Qibla</span>
            </div>
          </div>
        </div>

        {/* Installation Options */}
        <div className="mt-6 space-y-3">
          {/* Primary APK Download */}
          <a
            href={APK_URL}
            download="Shareek-App.apk"
            onClick={() => {
              // Give download time to initiate before closing
              setTimeout(onClose, 1000);
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand text-primary-foreground font-semibold text-sm shadow-md shadow-brand/25 hover:bg-deep transition flex items-center justify-center gap-2.5 cursor-pointer no-underline"
          >
            <Download className="size-4" />
            <span>Download Shareek Android APK (5.3 MB)</span>
          </a>

          {/* Secondary PWA Option */}
          {deferredPrompt && !isPwaInstalled && (
            <button
              type="button"
              onClick={handlePwaInstall}
              className="w-full py-3 px-5 rounded-2xl bg-panel border border-hairline text-deep font-semibold text-xs hover:bg-mist transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="size-4 text-deep/70" />
              <span>Add to Home Screen (Instant Web App)</span>
            </button>
          )}
        </div>

        {/* Quick Instructions */}
        <div className="mt-5 pt-4 border-t border-hairline text-xs text-deep/50 space-y-1 leading-relaxed">
          <p className="font-semibold text-deep/70">Quick Install Steps:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
            <li>Tap "Download Shareek Android APK" above.</li>
            <li>When downloaded, tap the notification or open your Downloads folder.</li>
            <li>If prompted by Android, tap "Settings" and enable "Allow from this source".</li>
            <li>Open Shareek and complete the Khushūʿ Shield permissions wizard!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
