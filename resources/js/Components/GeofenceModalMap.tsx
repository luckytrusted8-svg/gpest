import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface GeofenceModalMapProps {
    lat: number;
    lng: number;
    radius: number;
    onMapClick: (lat: number, lng: number) => void;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (e && e.latlng) {
                onClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

export default function GeofenceModalMap({ lat, lng, radius, onMapClick }: GeofenceModalMapProps) {
    const validLat = !isNaN(Number(lat)) && Number(lat) !== 0 ? Number(lat) : -6.2088;
    const validLng = !isNaN(Number(lng)) && Number(lng) !== 0 ? Number(lng) : 106.8456;
    const validRadius = !isNaN(Number(radius)) && Number(radius) > 0 ? Number(radius) : 100;

    return (
        <div className="h-[300px] rounded-md overflow-hidden border border-hairline">
            <MapContainer
                key={`${validLat}-${validLng}`}
                center={[validLat, validLng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onClick={onMapClick} />
                <CircleMarker
                    center={[validLat, validLng]}
                    radius={Math.min(validRadius / 10, 150)}
                    pathOptions={{
                        color: '#0070f3',
                        fillColor: '#0070f3',
                        fillOpacity: 0.15,
                        weight: 2,
                    }}
                />
            </MapContainer>
        </div>
    );
}
