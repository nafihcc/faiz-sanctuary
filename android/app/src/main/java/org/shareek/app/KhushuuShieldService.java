package org.shareek.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import androidx.core.app.NotificationCompat;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class KhushuuShieldService extends Service {

    public static final String CHANNEL_ID = "shareek_khushuu_channel";
    private static final int NOTIFICATION_ID = 1001;

    private Handler handler;
    private Runnable monitorRunnable;
    private Set<String> blockedPackages = new HashSet<>();
    private long endTimeMillis = 0;
    private String prayerName = "Salah";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        handler = new Handler(Looper.getMainLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "STOP_SHIELD".equals(intent.getAction())) {
            stopMonitoring();
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        if (intent != null) {
            String appIds = intent.getStringExtra("blockedAppIds");
            if (appIds == null) appIds = "instagram,tiktok,youtube,whatsapp";
            int durationMinutes = intent.getIntExtra("durationMinutes", 20);
            prayerName = intent.getStringExtra("prayerName");
            if (prayerName == null || prayerName.isEmpty()) prayerName = "Salah";

            initBlockedPackages(appIds);
            endTimeMillis = System.currentTimeMillis() + (durationMinutes * 60 * 1000L);
        }

        Notification notification = buildNotification("Khushūʿ Shield Active", 
            prayerName + " guard is protecting your prayer from distractions.");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }

        startMonitoring();
        return START_STICKY;
    }

    private void initBlockedPackages(String appIds) {
        blockedPackages.clear();
        String[] ids = appIds.toLowerCase().split(",");
        for (String id : ids) {
            String trimmed = id.trim();
            switch (trimmed) {
                case "instagram":
                    blockedPackages.add("com.instagram.android");
                    break;
                case "tiktok":
                    blockedPackages.add("com.zhiliaoapp.musically");
                    blockedPackages.add("com.ss.android.ugc.trill");
                    break;
                case "youtube":
                    blockedPackages.add("com.google.android.youtube");
                    blockedPackages.add("com.google.android.apps.youtube.music");
                    break;
                case "whatsapp":
                    blockedPackages.add("com.whatsapp");
                    blockedPackages.add("com.whatsapp.w4b");
                    break;
                case "facebook":
                    blockedPackages.add("com.facebook.katana");
                    blockedPackages.add("com.facebook.orca");
                    break;
                case "snapchat":
                    blockedPackages.add("com.snapchat.android");
                    break;
                case "twitter":
                case "x":
                    blockedPackages.add("com.twitter.android");
                    break;
                case "reddit":
                    blockedPackages.add("com.reddit.frontpage");
                    break;
                case "netflix":
                    blockedPackages.add("com.netflix.mediaclient");
                    break;
                case "telegram":
                    blockedPackages.add("org.telegram.messenger");
                    break;
                default:
                    // If custom package or id
                    if (trimmed.contains(".")) {
                        blockedPackages.add(trimmed);
                    }
                    break;
            }
        }
    }

    private void startMonitoring() {
        if (monitorRunnable != null) handler.removeCallbacks(monitorRunnable);

        monitorRunnable = new Runnable() {
            @Override
            public void run() {
                long now = System.currentTimeMillis();
                if (endTimeMillis > 0 && now >= endTimeMillis) {
                    stopMonitoring();
                    stopForeground(true);
                    stopSelf();
                    return;
                }

                checkForegroundApp();
                handler.postDelayed(this, 1200); // Check every 1.2s
            }
        };

        handler.post(monitorRunnable);
    }

    private void checkForegroundApp() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1) return;

        try {
            UsageStatsManager usm = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
            if (usm == null) return;

            long now = System.currentTimeMillis();
            long begin = now - 5000;
            UsageEvents events = usm.queryEvents(begin, now);
            if (events == null) return;

            String topPackage = null;
            UsageEvents.Event event = new UsageEvents.Event();
            while (events.hasNextEvent()) {
                events.getNextEvent(event);
                if (event.getEventType() == UsageEvents.Event.ACTIVITY_RESUMED) {
                    topPackage = event.getPackageName();
                }
            }

            if (topPackage != null && !topPackage.equals(getPackageName())) {
                if (blockedPackages.contains(topPackage)) {
                    // Blocked app detected! Bring Shareek Khushūʿ Lock to front
                    Intent lockIntent = new Intent(this, MainActivity.class);
                    lockIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                    lockIntent.putExtra("show_khushuu_lock", true);
                    lockIntent.putExtra("blocked_app", topPackage);
                    startActivity(lockIntent);
                }
            }
        } catch (Exception e) {
            // ignore
        }
    }

    private void stopMonitoring() {
        if (handler != null && monitorRunnable != null) {
            handler.removeCallbacks(monitorRunnable);
            monitorRunnable = null;
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Khushūʿ Shield Prayer Guard",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Background focus lock preventing app distractions during prayer times");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }
    }

    private Notification buildNotification(String title, String message) {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        notificationIntent.putExtra("show_khushuu_lock", true);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(message)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }

    @Override
    public void onDestroy() {
        stopMonitoring();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
