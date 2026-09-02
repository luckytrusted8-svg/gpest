import { useEffect, useRef } from 'react';
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
    dalam_perjalanan: 'Dalam Perjalanan (OTW)',
    tiba: 'Tiba di Lokasi',
    bekerja: 'Sedang Bekerja',
    offline: 'Offline',
};

const statusColors: Record<string, string> = {
    aktif: '#059669',
    dalam_perjalanan: '#2563eb',
    tiba: '#7c3aed',
    bekerja: '#d97706',
    offline: '#64748b',
};

export default function HistoryMap({ tracks = [] }: HistoryMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerGroupRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Map
        const map = L.map(containerRef.current, {
            center: [-6.2088, 106.8456],
            zoom: 13,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        const layerGroup = L.layerGroup().addTo(map);
        mapRef.current = map;
        layerGroupRef.current = layerGroup;

        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 200);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                layerGroupRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !layerGroupRef.current) return;

        const layer = layerGroupRef.current;
        layer.clearLayers();

        const validTracks = tracks.filter((t) => {
            const lat = Number(t.latitude);
            const lng = Number(t.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });

        if (validTracks.length === 0) return;

        const polylinePositions: [number, number][] = validTracks.map((t) => [Number(t.latitude), Number(t.longitude)]);

        if (polylinePositions.length > 1) {
            L.polyline(polylinePositions, {
                color: '#2563eb',
                weight: 4,
                opacity: 0.8,
            }).addTo(layer);
        }

        validTracks.forEach((track, idx) => {
            const lat = Number(track.latitude);
            const lng = Number(track.longitude);
            const color = statusColors[track.status_teknisi] || '#64748b';

            const marker = L.circleMarker([lat, lng], {
                radius: 8,
                color: '#ffffff',
                fillColor: color,
                fillOpacity: 1,
                weight: 2,
            });

            const popupContent = `
                <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
                    <strong>Titik Rute #${idx + 1}</strong><br/>
                    <span style="color: #64748b;">Waktu: ${new Date(track.created_at).toLocaleTimeString('id-ID')}</span><br/>
                    <span style="color: ${color}; font-weight: bold;">Status: ${statusLabels[track.status_teknisi] || track.status_teknisi}</span>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.addTo(layer);
        });

        if (polylinePositions.length > 0) {
            if (polylinePositions.length === 1) {
                mapRef.current.setView(polylinePositions[0], 15);
            } else {
                const bounds = L.latLngBounds(polylinePositions);
                mapRef.current.fitBounds(bounds, { padding: [40, 40] });
            }
        }
    }, [tracks]);

    return (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-xs h-[450px] w-full">
            <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
}
