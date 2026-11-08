import { registerPlugin, Capacitor } from "@capacitor/core";

export interface ShieldPermissionsStatus {
  hasOverlay: boolean;
  hasUsageStats: boolean;
  isBatteryIgnored: boolean;
  hasNotifications: boolean;
  allGranted: boolean;
}

export interface KhushuuShieldPluginInterface {
  checkPermissions(): Promise<ShieldPermissionsStatus>;
  requestOverlayPermission(): Promise<void>;
  requestUsageStatsPermission(): Promise<void>;
  requestBatteryOptimization(): Promise<void>;
  requestNotificationPermission(): Promise<void>;
  startShieldService(options: {
    blockedAppIds: string;
    durationMinutes: number;
    prayerName: string;
  }): Promise<{ success: boolean }>;
  stopShieldService(): Promise<{ success: boolean }>;
}

const NativePlugin = registerPlugin<KhushuuShieldPluginInterface>("KhushuuShield");

export const KhushuuNative = {
  isNative(): boolean {
    return Capacitor.isNativePlatform();
  },

  async checkPermissions(): Promise<ShieldPermissionsStatus> {
    if (!Capacitor.isNativePlatform()) {
      // In web browser / PWA simulation
      const savedOverlay = localStorage.getItem("khushuu_sim_overlay") === "true";
      const savedUsage = localStorage.getItem("khushuu_sim_usage") === "true";
      const savedBattery = localStorage.getItem("khushuu_sim_battery") === "true";
      const notifGranted =
        typeof Notification !== "undefined" && Notification.permission === "granted";

      return {
        hasOverlay: savedOverlay,
        hasUsageStats: savedUsage,
        isBatteryIgnored: savedBattery,
        hasNotifications: notifGranted,
        allGranted: savedOverlay && savedUsage && savedBattery,
      };
    }

    try {
      return await NativePlugin.checkPermissions();
    } catch (e) {
      console.warn("KhushuuShield.checkPermissions failed:", e);
      return {
        hasOverlay: false,
        hasUsageStats: false,
        isBatteryIgnored: false,
        hasNotifications: false,
        allGranted: false,
      };
    }
  },

  async requestOverlay(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      localStorage.setItem("khushuu_sim_overlay", "true");
      return;
    }
    try {
      await NativePlugin.requestOverlayPermission();
    } catch (e) {
      console.warn("KhushuuShield.requestOverlayPermission failed:", e);
    }
  },

  async requestUsageStats(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      localStorage.setItem("khushuu_sim_usage", "true");
      return;
    }
    try {
      await NativePlugin.requestUsageStatsPermission();
    } catch (e) {
      console.warn("KhushuuShield.requestUsageStatsPermission failed:", e);
    }
  },

  async requestBattery(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      localStorage.setItem("khushuu_sim_battery", "true");
      return;
    }
    try {
      await NativePlugin.requestBatteryOptimization();
    } catch (e) {
      console.warn("KhushuuShield.requestBatteryOptimization failed:", e);
    }
  },

  async requestNotifications(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      if (typeof Notification !== "undefined") {
        await Notification.requestPermission();
      }
      return;
    }
    try {
      await NativePlugin.requestNotificationPermission();
    } catch (e) {
      console.warn("KhushuuShield.requestNotificationPermission failed:", e);
    }
  },

  async startService(blockedAppIds: string[], durationMinutes: number, prayerName: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    try {
      const res = await NativePlugin.startShieldService({
        blockedAppIds: blockedAppIds.join(","),
        durationMinutes,
        prayerName,
      });
      return res.success;
    } catch (e) {
      console.warn("KhushuuShield.startShieldService failed:", e);
      return false;
    }
  },

  async stopService(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }
    try {
      const res = await NativePlugin.stopShieldService();
      return res.success;
    } catch (e) {
      console.warn("KhushuuShield.stopShieldService failed:", e);
      return false;
    }
  },
};
