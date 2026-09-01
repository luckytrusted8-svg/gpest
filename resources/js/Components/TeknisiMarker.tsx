import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface TeknisiData {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
    status_teknisi: string;
    last_update: string | null;
    schedule: { id: number; schedule_code: string; lokasi: string } | null;
}

function timeAgo(dateStr: string | null): string {
    if (!dateStr) return '-';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const statusColors: Record<string, string> = {
    aktif: '#16a34a',
    dalam_perjalanan: '#2563eb',
    tiba: '#7928ca',
    bekerja: '#f5a623',
    offline: '#888888',
};

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    dalam_perjalanan: 'Dalam Perjalanan',
    tiba: 'Tiba',
    bekerja: 'Bekerja',
    offline: 'Offline',
};

function createIcon(initials: string, color: string): L.DivIcon {
    return L.divIcon({
        className: '',
        html: `<div style="
            width: 36px; height: 36px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 12px; font-weight: 700;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: system-ui, sans-serif;
        ">${initials}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
    });
}

export default function TeknisiMarker({ data }: { data: TeknisiData }) {
    const lat = Number(data.latitude);
    const lng = Number(data.longitude);

    if (!data.latitude || !data.longitude || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        return null;
    }

    const initials = (data.name || 'TN').slice(0, 2).toUpperCase();
    const color = statusColors[data.status_teknisi] || '#888888';

    return (
        <Marker
            position={[lat, lng]}
            icon={createIcon(initials, color)}
        >
            <Popup>
                <div className="p-1 min-w-[180px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <div className="font-semibold text-sm text-gray-900 mb-1">{data.name}</div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ background: color }}
                        />
                        <span className="text-xs text-gray-600">
                            {statusLabels[data.status_teknisi] || data.status_teknisi}
                        </span>
                    </div>
                    {data.schedule && (
                        <div className="text-xs text-gray-500 mb-1">
                            Jadwal: {data.schedule.schedule_code}
                            <br />{data.schedule.lokasi}
                        </div>
                    )}
                    <div className="text-[11px] text-gray-400 mt-1">
                        Update: {timeAgo(data.last_update)}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}
