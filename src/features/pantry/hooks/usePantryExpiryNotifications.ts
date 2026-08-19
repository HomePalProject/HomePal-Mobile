import { useEffect } from 'react';
import { useAppSelector } from '@/src/store';
import { PantryItemResponse } from '@/src/types/api';
import {
  requestPermissions,
  getScheduledNotifications,
  scheduleLocalNotification,
  cancelNotification,
} from '@/src/services/notifications/localNotificationService';

/**
 * Custom hook to synchronize Redux pantry items with local push notification schedules.
 * Alert is triggered exactly 48 hours before an item's expiration.
 */
export function usePantryExpiryNotifications() {
  const items = useAppSelector((state) => state.pantry.items);

  useEffect(() => {
    const syncExpiryNotifications = async () => {
      try {
        // Request permissions
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        // Get currently scheduled notifications on the device
        const scheduled = await getScheduledNotifications();
        const scheduledIds = new Set(scheduled.map((n) => n.identifier));

        // Create a fast lookup map for active pantry items
        const activeItemMap = new Map<string, PantryItemResponse>(
          items.map((item) => [item.id, item])
        );

        // 1. Reconcile currently scheduled notifications:
        // Cancel orphan notifications for items that were consumed, deleted,
        // or have changed expiration dates.
        for (const notification of scheduled) {
          const itemId = notification.identifier;
          const item = activeItemMap.get(itemId);

          if (!item) {
            // Cancel notification if the item is no longer in Redux
            await cancelNotification(itemId);
          } else {
            // Check if expireDate became invalid or target trigger is now in the past
            if (!item.expireDate) {
              await cancelNotification(itemId);
              continue;
            }

            const targetTriggerDate = new Date(
              new Date(item.expireDate).getTime() - 48 * 60 * 60 * 1000
              // new Date(Date.now() + 10 * 1000)
            );
            const now = new Date();

            if (targetTriggerDate <= now) {
              // Notification date is in the past, cancel
              await cancelNotification(itemId);
              continue;
            }

            // Detect if expireDate has changed. Compare scheduled trigger time with target trigger time.
            const trigger = notification.trigger as any;
            let scheduledTime: number | null = null;

            if (trigger && typeof trigger === 'object') {
              if (trigger.date) {
                scheduledTime = new Date(trigger.date).getTime();
              } else if (trigger.value) {
                scheduledTime = new Date(trigger.value).getTime();
              } else if (typeof trigger.timestamp === 'number') {
                scheduledTime = trigger.timestamp;
              }
            }

            if (scheduledTime) {
              const timeDiff = Math.abs(scheduledTime - targetTriggerDate.getTime());
              if (timeDiff > 5000) {
                // Trigger time has shifted beyond a 5-second threshold, cancel the old schedule
                await cancelNotification(itemId);
                scheduledIds.delete(itemId); // mark as not scheduled to trigger rescheduling below
              }
            }
          }
        }

        // 2. Schedule notifications for new or modified active items
        for (const item of items) {
          if (!item.expireDate) continue;

          const targetTriggerDate = new Date(
            new Date(item.expireDate).getTime() - 48 * 60 * 60 * 1000
            // Date.now() + 10 * 1000
          );
          const now = new Date();

          if (targetTriggerDate > now) {
            // If the item is not already scheduled, trigger a new schedule
            if (!scheduledIds.has(item.id)) {
              const title = 'Pantry Expiry Alert';
              const body = `Your pantry item "${item.name}" will expire in 48 hours! Consider using it soon.`;
              await scheduleLocalNotification(item.id, title, body, targetTriggerDate);
            }
          }
        }
      } catch (error) {
        console.warn('[usePantryExpiryNotifications] Sync error:', error);
      }
    };

    syncExpiryNotifications();
  }, [items]);
}
