import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import TeknisiMarker from '@/Components/TeknisiMarker';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export interface TeknisiData {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
    status_teknisi: string;
    last_update: string | null;
    schedule: { id: number; schedule_code: string; lokasi: string } | null;
}

export interface GeofenceData {
    id: number;
    nama: string;
    latitude_pusat: number;
    longitude_pusat: number;
    radius_meter: number;
    aktif: boolean;
}

interface TrackingMapProps {
    data?: TeknisiData[];
    geofences?: GeofenceData[];
}

function FitBounds({ technicians }: { technicians: TeknisiData[] }) {
    const map = useMap();
    useEffect(() => {
        const valid = technicians.filter((t) => {
            const lat = Number(t.latitude);
            const lng = Number(t.longitude);
            return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        });

        if (valid.length === 0) return;

        if (valid.length === 1) {
            map.setView([Number(valid[0].latitude), Number(valid[0].longitude)], 15);
        } else {
            const bounds = L.latLngBounds(valid.map((t) => [Number(t.latitude), Number(t.longitude)] as [number, number]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [technicians, map]);
    return null;
}

export default function TrackingMap({ data = [], geofences = [] }: TrackingMapProps) {
    useEffect(() => {
        try {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: markerIcon,
                shadowUrl: markerShadow,
            });
        } catch (e) {
            console.warn('Leaflet icon override warning:', e);
        }
    }, []);

    const validGeofences = geofences.filter((gf) => {
        const lat = Number(gf.latitude_pusat);
        const lng = Number(gf.longitude_pusat);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
                center={[-6.2088, 106.8456]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds technicians={data} />
                {data.map((tech) => (
                    <TeknisiMarker key={tech.id} data={tech} />
                ))}
                {validGeofences.map((gf) => {
                    const lat = Number(gf.latitude_pusat);
                    const lng = Number(gf.longitude_pusat);
                    const radius = Number(gf.radius_meter) || 100;
                    return (
                        <CircleMarker
                            key={gf.id}
                            center={[lat, lng]}
                            radius={Math.min(radius / 10, 200)}
                            pathOptions={{
                                color: '#0070f3',
                                fillColor: '#0070f3',
                                fillOpacity: 0.08,
                                weight: 1,
                            }}
                        >
                            <Popup>
                                <div className="p-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                    <div className="font-semibold text-sm">{gf.nama}</div>
                                    <div className="text-xs text-gray-500">Radius: {radius}m</div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
