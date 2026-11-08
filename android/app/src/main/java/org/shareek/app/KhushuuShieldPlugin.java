package org.shareek.app;

import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KhushuuShield")
public class KhushuuShieldPlugin extends Plugin {

    @PluginMethod
    public void checkPermissions(PluginCall call) {
        Context context = getContext();
        JSObject ret = new JSObject();

        // 1. Overlay permission ("Display over other apps")
        boolean hasOverlay = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            hasOverlay = Settings.canDrawOverlays(context);
        }
        ret.put("hasOverlay", hasOverlay);

        // 2. Usage Stats permission ("Usage access" to detect foreground distracting apps)
        boolean hasUsageStats = false;
        try {
            AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
            if (appOps != null) {
                int mode = appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    android.os.Process.myUid(),
                    context.getPackageName()
                );
                hasUsageStats = (mode == AppOpsManager.MODE_ALLOWED);
            }
        } catch (Exception e) {
            hasUsageStats = false;
        }
        ret.put("hasUsageStats", hasUsageStats);

        // 3. Battery Optimization ("Ignore battery optimizations / unrestricted")
        boolean isBatteryIgnored = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            isBatteryIgnored = (pm != null && pm.isIgnoringBatteryOptimizations(context.getPackageName()));
        }
        ret.put("isBatteryIgnored", isBatteryIgnored);

        // 4. Notifications
        boolean hasNotifications = NotificationManagerCompat.from(context).areNotificationsEnabled();
        ret.put("hasNotifications", hasNotifications);

        // Ready indicator
        boolean allGranted = hasOverlay && hasUsageStats && isBatteryIgnored;
        ret.put("allGranted", allGranted);

        call.resolve(ret);
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        Context context = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + context.getPackageName())
                );
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception e) {
                Intent fallback = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(fallback);
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void requestUsageStatsPermission(PluginCall call) {
        Context context = getContext();
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        } catch (Exception e) {
            // ignore
        }
        call.resolve();
    }

    @PluginMethod
    public void requestBatteryOptimization(PluginCall call) {
        Context context = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + context.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception e) {
                try {
                    Intent fallback = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(fallback);
                } catch (Exception ex) {
                    // ignore
                }
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void requestNotificationPermission(PluginCall call) {
        Context context = getContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_APP_PACKAGE, context.getPackageName());
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (Exception e) {
                // ignore
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void startShieldService(PluginCall call) {
        Context context = getContext();
        String blockedApps = call.getString("blockedAppIds", "instagram,tiktok,youtube,whatsapp");
        int durationMinutes = call.getInt("durationMinutes", 20);
        String prayerName = call.getString("prayerName", "Salah");

        Intent serviceIntent = new Intent(context, KhushuuShieldService.class);
        serviceIntent.setAction("START_SHIELD");
        serviceIntent.putExtra("blockedAppIds", blockedApps);
        serviceIntent.putExtra("durationMinutes", durationMinutes);
        serviceIntent.putExtra("prayerName", prayerName);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }

        JSObject res = new JSObject();
        res.put("success", true);
        call.resolve(res);
    }

    @PluginMethod
    public void stopShieldService(PluginCall call) {
        Context context = getContext();
        Intent serviceIntent = new Intent(context, KhushuuShieldService.class);
        serviceIntent.setAction("STOP_SHIELD");
        context.stopService(serviceIntent);

        JSObject res = new JSObject();
        res.put("success", true);
        call.resolve(res);
    }
}
