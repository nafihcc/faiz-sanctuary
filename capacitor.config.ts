import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.shareek.app',
  appName: 'Shareek',
  webDir: 'dist-gh',
  server: {
    androidScheme: 'https',
  },
};

export default config;
