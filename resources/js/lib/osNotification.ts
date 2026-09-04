/**
 * OS Desktop Notification, App Badging API, and Dynamic Title Counter
 * Works outside the browser (Desktop Taskbar PWA Icon, Windows OS Toast, and Tab Header).
 */

export function requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }
}

export function sendDesktopNotification(title: string, options?: { body?: string; url?: string; icon?: string }) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        try {
            const notif = new Notification(title, {
                body: options?.body || 'Anda memiliki pemberitahuan baru di G-PEST.',
                icon: options?.icon || '/images/logo.png',
                badge: '/images/logo.png',
                silent: false,
            });

            notif.onclick = () => {
                window.focus();
                if (options?.url) {
                    window.location.href = options.url;
                }
                notif.close();
            };
        } catch {
            // fallback safe
        }
    }
}

export function setAppBadgeCount(count: number) {
    if (typeof navigator === 'undefined') return;

    try {
        if ('setAppBadge' in navigator && typeof (navigator as any).setAppBadge === 'function') {
            if (count > 0) {
                (navigator as any).setAppBadge(count).catch(() => {});
            } else {
                (navigator as any).clearAppBadge().catch(() => {});
            }
        }
    } catch {
        // failover
    }

    // Dynamic document title counter (e.g. "(3) Dashboard - G-PEST")
    try {
        const cleanTitle = document.title.replace(/^\(\d+\+?\)\s*/, '');
        if (count > 0) {
            document.title = `(${count > 99 ? '99+' : count}) ${cleanTitle}`;
        } else {
            document.title = cleanTitle;
        }
    } catch {
        // failover
    }
}
