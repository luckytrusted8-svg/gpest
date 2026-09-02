import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface GeofenceModalMapProps {
    lat: number | string;
    lng: number | string;
    radius: number | string;
    onMapClick: (lat: number, lng: number) => void;
}

export default function GeofenceModalMap({ lat, lng, radius, onMapClick }: GeofenceModalMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.CircleMarker | null>(null);
    const circleRef = useRef<L.Circle | null>(null);

    const validLat = !isNaN(Number(lat)) && Number(lat) !== 0 ? Number(lat) : -6.2088;
    const validLng = !isNaN(Number(lng)) && Number(lng) !== 0 ? Number(lng) : 106.8456;
    const validRadius = !isNaN(Number(radius)) && Number(radius) > 0 ? Number(radius) : 100;

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Map
        const map = L.map(containerRef.current, {
            center: [validLat, validLng],
            zoom: 15,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Click Handler on Map
        map.on('click', (e: L.LeafletMouseEvent) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        });

        // Center Pin Marker
        const marker = L.circleMarker([validLat, validLng], {
            radius: 9,
            color: '#1e40af',
            fillColor: '#3b82f6',
            fillOpacity: 0.9,
            weight: 3,
        }).addTo(map);

        // Geofence Radius Circle
        const circle = L.circle([validLat, validLng], {
            radius: validRadius,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.18,
            weight: 2,
        }).addTo(map);

        mapRef.current = map;
        markerRef.current = marker;
        circleRef.current = circle;

        // Force container resize calculation after modal opens
        const t1 = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 150);

        const t2 = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 400);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
                circleRef.current = null;
            }
        };
    }, []);

    // Sync Props Updates with Leaflet Map Instance
    useEffect(() => {
        if (mapRef.current && !isNaN(validLat) && !isNaN(validLng)) {
            mapRef.current.setView([validLat, validLng], mapRef.current.getZoom());

            if (markerRef.current) {
                markerRef.current.setLatLng([validLat, validLng]);
            }

            if (circleRef.current) {
                circleRef.current.setLatLng([validLat, validLng]);
                circleRef.current.setRadius(validRadius);
            }
        }
    }, [validLat, validLng, validRadius]);

    return (
        <div className="space-y-1">
            <style>{`
                .leaflet-container {
                    border-radius: 0.75rem !important;
                    background-color: #f8fafc !important;
                }
                .leaflet-tile {
                    border: none !important;
                    outline: none !important;
                }
            `}</style>
            <div className="relative h-[270px] rounded-xl overflow-hidden border border-slate-300 shadow-xs z-10">
                <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

                <div className="absolute bottom-2.5 left-2.5 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] font-mono text-slate-800 font-semibold shadow-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Pusat Geofence: {validLat.toFixed(6)}, {validLng.toFixed(6)} ({validRadius}m)</span>
                </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
                * Klik pada peta di atas untuk menentukan posisi koordinat pusat geofence.
            </p>
        </div>
    );
}
