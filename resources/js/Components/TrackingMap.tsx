import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    customer_id?: number | null;
    customer?: { id: number; company_name: string } | null;
    latitude_pusat: number;
    longitude_pusat: number;
    radius_meter: number;
    aktif: boolean;
}

interface TrackingMapProps {
    data?: TeknisiData[];
    geofences?: GeofenceData[];
    height?: string;
    focusTarget?: { lat: number; lng: number; zoom?: number } | null;
}

// Calculate distance in meters between two GPS coordinates using Haversine formula
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

export default function TrackingMap({ data = [], geofences = [], height = '560px', focusTarget }: TrackingMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Map
        const map = L.map(containerRef.current, {
            center: [-6.2088, 106.8456],
            zoom: 12,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        mapRef.current = map;
        markersLayerRef.current = markersLayer;

        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 200);

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersLayerRef.current = null;
            }
        };
    }, []);

    // Handle flyTo when focusTarget changes (e.g. when user clicks Geofence card or Technician card)
    useEffect(() => {
        if (mapRef.current && focusTarget && !isNaN(focusTarget.lat) && !isNaN(focusTarget.lng)) {
            mapRef.current.flyTo([focusTarget.lat, focusTarget.lng], focusTarget.zoom || 16, {
                animate: true,
                duration: 1.2,
            });
        }
    }, [focusTarget]);

    // Dynamically update Geofence circles and Technician markers
    useEffect(() => {
        if (!mapRef.current || !markersLayerRef.current) return;

        const layer = markersLayerRef.current;
        layer.clearLayers();

        const latLngList: [number, number][] = [];

        // 1. Render Geofence Radius Circles with Technician Count Indicators
        geofences.forEach((gf) => {
            const gfLat = Number(gf.latitude_pusat);
            const gfLng = Number(gf.longitude_pusat);
            const radius = Number(gf.radius_meter) || 100;

            if (!isNaN(gfLat) && !isNaN(gfLng) && gfLat !== 0 && gfLng !== 0) {
                latLngList.push([gfLat, gfLng]);

                // Find technicians inside this geofence radius
                const techsInside = data.filter((t) => {
                    if (!t.latitude || !t.longitude) return false;
                    const dist = getDistanceMeters(Number(t.latitude), Number(t.longitude), gfLat, gfLng);
                    return dist <= radius;
                });

                const isAnyTechInside = techsInside.length > 0;
                const circleColor = isAnyTechInside ? '#10b981' : '#2563eb';
                const fillColor = isAnyTechInside ? '#34d399' : '#3b82f6';

                // Geofence Circle Overlay
                const circle = L.circle([gfLat, gfLng], {
                    radius: radius,
                    color: circleColor,
                    fillColor: fillColor,
                    fillOpacity: 0.18,
                    weight: 2.5,
                });

                const popupContent = `
                    <div style="font-family: system-ui, sans-serif; font-size: 12px; min-width: 210px; padding: 4px;">
                        <div style="font-size: 13px; font-weight: bold; color: #1e3a8a; display: flex; align-items: center; gap: 4px;">
                            🛡️ Area Geofence: ${gf.nama}
                        </div>
                        <div style="color: #475569; font-size: 11px; margin-top: 3px;">
                            ${gf.customer?.company_name ? `Klien: <strong>${gf.customer.company_name}</strong><br/>` : ''}
                            Radius Terpasang: <strong>${radius} Meter</strong><br/>
                            Koordinat: <span style="font-family: monospace;">${gfLat.toFixed(5)}, ${gfLng.toFixed(5)}</span>
                        </div>
                        <div style="margin-top: 8px; padding: 6px 8px; background: ${isAnyTechInside ? '#ecfdf5' : '#f8fafc'}; border-radius: 8px; border: 1px solid ${isAnyTechInside ? '#a7f3d0' : '#e2e8f0'};">
                            <div style="font-weight: bold; color: ${isAnyTechInside ? '#047857' : '#475569'}; font-size: 11px;">
                                👥 Personel di Dalam Area (${techsInside.length} Orang):
                            </div>
                            ${techsInside.length > 0
                                ? techsInside.map(t => `<div style="font-size: 11px; font-weight: 600; color: #0f172a; margin-top: 3px;">• ${t.name} <span style="font-size: 10px; color: #059669;">(${t.status_teknisi.toUpperCase()})</span></div>`).join('')
                                : '<div style="font-size: 10px; color: #94a3b8; font-style: italic; margin-top: 2px;">Belum ada teknisi di dalam radius area ini.</div>'
                            }
                        </div>
                    </div>
                `;

                circle.bindPopup(popupContent);
                circle.addTo(layer);

                // Add center pin for Geofence
                L.circleMarker([gfLat, gfLng], {
                    radius: 6,
                    color: '#1e3a8a',
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    weight: 2.5,
                }).addTo(layer);
            }
        });

        // 2. Render Technician Markers
        data.forEach((tech) => {
            const lat = Number(tech.latitude);
            const lng = Number(tech.longitude);

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                latLngList.push([lat, lng]);

                // Check if technician is inside any active geofence
                let insideGeofenceName: string | null = null;
                let insideDistance: number | null = null;

                for (const gf of geofences) {
                    const gfLat = Number(gf.latitude_pusat);
                    const gfLng = Number(gf.longitude_pusat);
                    const radius = Number(gf.radius_meter) || 100;
                    const dist = getDistanceMeters(lat, lng, gfLat, gfLng);

                    if (dist <= radius) {
                        insideGeofenceName = gf.nama;
                        insideDistance = dist;
                        break;
                    }
                }

                const statusColor = tech.status_teknisi === 'bekerja' ? '#d97706' : (tech.status_teknisi === 'aktif' ? '#059669' : '#64748b');
                const outlineColor = insideGeofenceName ? '#10b981' : '#ffffff';

                const marker = L.circleMarker([lat, lng], {
                    radius: insideGeofenceName ? 13 : 11,
                    color: outlineColor,
                    fillColor: statusColor,
                    fillOpacity: 1,
                    weight: insideGeofenceName ? 4 : 3,
                });

                const popupContent = `
                    <div style="font-family: system-ui, sans-serif; font-size: 12px; padding: 2px;">
                        <strong style="font-size: 13px; color: #0f172a;">${tech.name}</strong><br/>
                        <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">Status: ${tech.status_teknisi}</span><br/>
                        ${insideGeofenceName ? `<div style="margin-top: 4px; padding: 4px 6px; background: #ecfdf5; border-radius: 6px; border: 1px solid #a7f3d0; color: #047857; font-weight: bold; font-size: 10px;">🛡️ Lokasi Presisi: Didalam Geofence "${insideGeofenceName}" (${insideDistance}m dari pusat)</div>` : ''}
                        ${tech.schedule ? `<div style="color: #2563eb; font-size: 11px; margin-top: 4px;">Tugas: <strong>${tech.schedule.schedule_code}</strong> - ${tech.schedule.lokasi}</div>` : ''}
                    </div>
                `;

                marker.bindPopup(popupContent);
                marker.addTo(layer);
            }
        });

        // Fit map bounds smoothly to fit all markers & geofences if no specific focusTarget
        if (!focusTarget && latLngList.length > 0) {
            if (latLngList.length === 1) {
                mapRef.current.setView(latLngList[0], 15);
            } else {
                const bounds = L.latLngBounds(latLngList);
                mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [data, geofences]);

    return (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-xs" style={{ height, width: '100%' }}>
            <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
}
