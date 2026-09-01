import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Track {
    id: number;
    latitude: number;
    longitude: number;
    akurasi: number | null;
    kecepatan: number | null;
    status_teknisi: string;
    created_at: string;
}

interface HistoryMapProps {
    tracks: Track[];
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    dalam_perjalanan: 'Dalam Perjalanan',
    tiba: 'Tiba',
    bekerja: 'Bekerja',
    offline: 'Offline',
};

const statusColors: Record<string, string> = {
    aktif: '#16a34a',
    dalam_perjalanan: '#2563eb',
    tiba: '#7928ca',
    bekerja: '#f5a623',
    offline: '#888888',
};

function FitBoundsMap({ tracks }: { tracks: Track[] }) {
    const map = useMap();
    if (tracks.length === 0) return null;

    const validTracks = tracks.filter((t) => {
        const lat = Number(t.latitude);
        const lng = Number(t.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    if (validTracks.length === 0) return null;

    const bounds = L.latLngBounds(validTracks.map((t) => [Number(t.latitude), Number(t.longitude)] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50] });
    return null;
}

function createIcon(color: string, label: string): L.DivIcon {
    return L.divIcon({
        className: '',
        html: `<div style="
            width: 20px; height: 20px;
            background: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 9px; font-weight: 700;
        ">${label}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12],
    });
}

export default function HistoryMap({ tracks = [] }: HistoryMapProps) {
    const validTracks = tracks.filter((t) => {
        const lat = Number(t.latitude);
        const lng = Number(t.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    const polylinePositions: [number, number][] = validTracks.map((t) => [Number(t.latitude), Number(t.longitude)]);

    const centerLat = validTracks.length > 0 ? Number(validTracks[0].latitude) : -6.2088;
    const centerLng = validTracks.length > 0 ? Number(validTracks[0].longitude) : 106.8456;

    return (
        <div style={{ height: '450px', width: '100%' }}>
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBoundsMap tracks={validTracks} />
                {polylinePositions.length > 1 && (
                    <Polyline
                        positions={polylinePositions}
                        pathOptions={{ color: '#0070f3', weight: 3, opacity: 0.7 }}
                    />
                )}
                {validTracks.map((track, idx) => (
                    <Marker
                        key={track.id}
                        position={[Number(track.latitude), Number(track.longitude)]}
                        icon={createIcon(
                            statusColors[track.status_teknisi] || '#888888',
                            String(idx + 1)
                        )}
                    >
                        <Popup>
                            <div className="p-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                <div className="text-xs font-medium">#{idx + 1}</div>
                                <div className="text-[11px] text-gray-500">
                                    {new Date(track.created_at).toLocaleTimeString('id-ID')}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                    {statusLabels[track.status_teknisi]}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
