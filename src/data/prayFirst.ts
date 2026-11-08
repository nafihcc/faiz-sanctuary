export interface BlockableApp {
  id: string;
  name: string;
  category: "social" | "video" | "messaging" | "gaming" | "custom";
  packageName: string;
  icon: string;
  defaultBlocked: boolean;
}

export interface AdhanOption {
  id: string;
  name: string;
  muadhin: string;
  location: string;
  audioUrl: string;
}

export interface PrayFirstConfig {
  shieldEnabled: boolean;
  adhanEnabled: boolean;
  selectedAdhan: string;
  prePrayerBufferMinutes: number; // minutes before Adhan to warn/start
  lockdownDurationMinutes: number; // minutes after Adhan to lock phone
  strictMode: boolean; // requires reflection/prayer confirmation to unlock
  blockedAppIds: string[];
  customApps: BlockableApp[];
  perPrayerAdhan: Record<string, boolean>; // e.g. { fajr: true, dhuhr: true, ... }
}

export const PRESET_APPS: BlockableApp[] = [
  // Social Media
  {
    id: "instagram",
    name: "Instagram",
    category: "social",
    packageName: "com.instagram.android",
    icon: "📸",
    defaultBlocked: true,
  },
  {
    id: "tiktok",
    name: "TikTok / Reels",
    category: "social",
    packageName: "com.zhiliaoapp.musically",
    icon: "🎵",
    defaultBlocked: true,
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    category: "social",
    packageName: "com.twitter.android",
    icon: "𝕏",
    defaultBlocked: true,
  },
  {
    id: "snapchat",
    name: "Snapchat",
    category: "social",
    packageName: "com.snapchat.android",
    icon: "👻",
    defaultBlocked: true,
  },
  {
    id: "facebook",
    name: "Facebook",
    category: "social",
    packageName: "com.facebook.katana",
    icon: "📘",
    defaultBlocked: true,
  },

  // Video & Entertainment
  {
    id: "youtube",
    name: "YouTube & Shorts",
    category: "video",
    packageName: "com.google.android.youtube",
    icon: "▶️",
    defaultBlocked: true,
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "video",
    packageName: "com.netflix.mediaclient",
    icon: "🍿",
    defaultBlocked: false,
  },

  // Messaging & Forums
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "messaging",
    packageName: "com.whatsapp",
    icon: "💬",
    defaultBlocked: false,
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "messaging",
    packageName: "org.telegram.messenger",
    icon: "✈️",
    defaultBlocked: false,
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "messaging",
    packageName: "com.reddit.frontpage",
    icon: "🤖",
    defaultBlocked: true,
  },

  // Games
  {
    id: "gaming",
    name: "All Mobile Games",
    category: "gaming",
    packageName: "com.games.all",
    icon: "🎮",
    defaultBlocked: true,
  },
];

export const ADHAN_OPTIONS: AdhanOption[] = [
  {
    id: "makkah",
    name: "Makkah Al-Mukarramah",
    muadhin: "Sheikh Ali Ahmed Mulla",
    location: "Masjid al-Haram, Makkah",
    audioUrl: "https://cdn.aladhan.com/audio/adhans/makkah.mp3",
  },
  {
    id: "madinah",
    name: "Madinah Al-Munawwarah",
    muadhin: "Sheikh Essam Bukhari",
    location: "Al-Masjid an-Nabawi, Madinah",
    audioUrl: "https://cdn.aladhan.com/audio/adhans/madina.mp3",
  },
  {
    id: "alaqsa",
    name: "Al-Quds / Al-Aqsa",
    muadhin: "Sheikh Naji Qazzaz",
    location: "Al-Masjid al-Aqsa, Jerusalem",
    audioUrl: "https://cdn.aladhan.com/audio/adhans/alaqsa.mp3",
  },
  {
    id: "istanbul",
    name: "Istanbul Traditional",
    muadhin: "Hafiz Mustafa Özcan",
    location: "Sultanahmet Mosque, Istanbul",
    audioUrl: "https://cdn.aladhan.com/audio/adhans/turkey.mp3",
  },
];

export const DEFAULT_CONFIG: PrayFirstConfig = {
  shieldEnabled: true,
  adhanEnabled: true,
  selectedAdhan: "makkah",
  prePrayerBufferMinutes: 5,
  lockdownDurationMinutes: 20,
  strictMode: false,
  blockedAppIds: PRESET_APPS.filter((a) => a.defaultBlocked).map((a) => a.id),
  customApps: [],
  perPrayerAdhan: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

export const PRAY_FIRST_STORAGE_KEY = "shareek.prayfirst.config";

export function loadPrayFirstConfig(): PrayFirstConfig {
  try {
    const raw = localStorage.getItem(PRAY_FIRST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

export function savePrayFirstConfig(config: PrayFirstConfig) {
  try {
    localStorage.setItem(PRAY_FIRST_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}
