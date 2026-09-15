import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Compass, Search, Loader2 } from 'lucide-react';

interface LeafletLocationPickerProps {
    lat: number | string;
    lng: number | string;
    radius?: number;
    onLocationSelect?: (lat: number, lng: number, addressSuggestion?: string, locationArea?: string) => void;
    height?: string;
    readonly?: boolean;
}

export default function LeafletLocationPicker({
    lat,
    lng,
    radius = 100,
    onLocationSelect,
    height = '320px',
    readonly = false,
}: LeafletLocationPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerInstanceRef = useRef<L.CircleMarker | L.Marker | null>(null);
    const circleInstanceRef = useRef<L.Circle | null>(null);

    const [loadingGps, setLoadingGps] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [reverseGeocoding, setReverseGeocoding] = useState(false);

    const numLat = !isNaN(Number(lat)) && Number(lat) !== 0 ? Number(lat) : -6.2088;
    const numLng = !isNaN(Number(lng)) && Number(lng) !== 0 ? Number(lng) : 106.8456;

    // Helper to extract clean location area (e.g., "Ciledug", "Karang Tengah", "Jakarta Selatan", "Tangerang")
    const extractLocationArea = (addr: any): string => {
        if (!addr) return '';
        return (
            addr.city_district ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.quarter ||
            addr.city ||
            addr.municipality ||
            addr.town ||
            addr.county ||
            ''
        );
    };

    // Helper to format clean, detailed, and precise Indonesian address
    const formatAddressString = (addr: any, displayName: string): string => {
        if (!addr) return displayName || '';
        const parts: string[] = [];

        // Building / Place
        if (addr.building || addr.house_name || addr.amenity) {
            parts.push(addr.building || addr.house_name || addr.amenity);
        }

        // Road & house number
        if (addr.road) {
            let road = addr.road;
            if (addr.house_number) {
                road += ` No. ${addr.house_number}`;
            }
            parts.push(road);
        }

        // Village / Kelurahan / Suburb
        if (addr.village || addr.suburb || addr.neighbourhood || addr.quarter) {
            const sub = addr.village || addr.suburb || addr.neighbourhood || addr.quarter;
            if (!parts.includes(sub)) {
                parts.push(sub);
            }
        }

        // District / Kecamatan
        if (addr.city_district || addr.district) {
            const dist = addr.city_district || addr.district;
            if (!parts.includes(`Kec. ${dist}`) && !parts.includes(dist)) {
                parts.push(`Kec. ${dist}`);
            }
        }

        // City / Kota / Kabupaten
        if (addr.city || addr.town || addr.municipality || addr.county) {
            const city = addr.city || addr.town || addr.municipality || addr.county;
            if (!parts.includes(city)) {
                parts.push(city);
            }
        }

        // Province / State
        if (addr.state && !parts.includes(addr.state)) {
            parts.push(addr.state);
        }

        // Postcode
        if (addr.postcode) {
            parts.push(addr.postcode);
        }

        if (parts.length >= 2) {
            return parts.join(', ');
        }

        return displayName || '';
    };

    // Reverse geocode lat/lng to get address and area
    const fetchReverseGeocode = async (latitude: number, longitude: number) => {
        if (!onLocationSelect) return;
        setReverseGeocoding(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await res.json();
            if (data && data.address) {
                const area = extractLocationArea(data.address);
                const fullAddress = formatAddressString(data.address, data.display_name);
                onLocationSelect(latitude, longitude, fullAddress, area);
            } else {
                onLocationSelect(latitude, longitude);
            }
        } catch {
            onLocationSelect(latitude, longitude);
        } finally {
            setReverseGeocoding(false);
        }
    };

    // Initialize Vanilla Leaflet Map (Pure Leaflet JS, no react-leaflet context dependency)
    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Map
        const map = L.map(containerRef.current, {
            center: [numLat, numLng],
            zoom: 15,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        // Click Handler on Map (only when not readonly)
        if (!readonly && onLocationSelect) {
            map.on('click', (e: L.LeafletMouseEvent) => {
                fetchReverseGeocode(e.latlng.lat, e.latlng.lng);
            });
        }

        // Add Marker
        const marker = L.circleMarker([numLat, numLng], {
            radius: 10,
            color: '#1e40af',
            fillColor: '#3b82f6',
            fillOpacity: 0.9,
            weight: 3,
        }).addTo(map);

        // Add Radius Geofence Circle
        const circle = L.circle([numLat, numLng], {
            radius: radius > 0 ? radius : 100,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            weight: 2,
        }).addTo(map);

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
        circleInstanceRef.current = circle;

        // Force invalidateSize after render to fix Leaflet container size
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 200);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerInstanceRef.current = null;
                circleInstanceRef.current = null;
            }
        };
    }, []);

    // Synchronize Lat/Lng/Radius changes with active Leaflet Map
    useEffect(() => {
        if (mapInstanceRef.current && !isNaN(numLat) && !isNaN(numLng)) {
            mapInstanceRef.current.setView([numLat, numLng], mapInstanceRef.current.getZoom());

            if (markerInstanceRef.current) {
                markerInstanceRef.current.setLatLng([numLat, numLng]);
            }

            if (circleInstanceRef.current) {
                circleInstanceRef.current.setLatLng([numLat, numLng]);
                circleInstanceRef.current.setRadius(radius > 0 ? radius : 100);
            }
        }
    }, [numLat, numLng, radius]);

    const handleGetCurrentLocation = () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            alert('Browser Anda tidak mendukung fitur Geolocation GPS.');
            return;
        }

        setLoadingGps(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLoadingGps(false);
                fetchReverseGeocode(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                setLoadingGps(false);
                alert('Gagal mendapatkan lokasi GPS: ' + err.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSearchAddress = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const first = data[0];
                const foundLat = parseFloat(first.lat);
                const foundLng = parseFloat(first.lon);
                const area = extractLocationArea(first.address);
                const fullAddress = formatAddressString(first.address, first.display_name);
                onLocationSelect?.(foundLat, foundLng, fullAddress, area);
            } else {
                alert('Lokasi tidak ditemukan. Coba kata kunci yang lebih spesifik.');
            }
        } catch {
            alert('Gagal mencari lokasi. Pastikan koneksi internet aktif.');
        } finally {
            setSearching(false);
        }
    };

    const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchAddress();
        }
    };

    return (
        <div className="space-y-2.5">
            {/* Toolbar Search & GPS (only in edit/picker mode) */}
            {!readonly && (
                <div className="flex flex-col sm:flex-row gap-2">
                    {/* Inline Search Input Group with embedded Search Button */}
                    <div className="relative flex-1 flex items-center">
                        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Cari nama jalan / gedung / wilayah di peta..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDownSearch}
                            className="w-full h-10 pl-9 pr-24 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            onClick={handleSearchAddress}
                            disabled={searching}
                            className="absolute right-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                        >
                            {searching ? 'Mencari...' : 'Cari di Peta'}
                        </button>
                    </div>

                    {/* Gunakan GPS Saya Button (Full width on mobile, inline on desktop) */}
                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        disabled={loadingGps || reverseGeocoding}
                        className="w-full sm:w-auto h-10 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shrink-0 transition-colors shadow-xs cursor-pointer"
                    >
                        {loadingGps || reverseGeocoding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Compass className="w-4 h-4" />
                        )}
                        <span>{loadingGps ? 'Mendeteksi GPS...' : reverseGeocoding ? 'Mengambil Alamat Presisi...' : 'Gunakan GPS Saya'}</span>
                    </button>
                </div>
            )}

            {/* Pure Vanilla Leaflet Map Container with Responsive Height */}
            <div
                className="relative rounded-xl overflow-hidden border border-slate-300 shadow-xs z-10 h-[230px] sm:h-[320px]"
                style={height ? { height } : undefined}
            >
                <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

                <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-300 text-[11px] font-mono text-slate-800 font-semibold shadow-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Lat: {numLat.toFixed(6)}, Lng: {numLng.toFixed(6)}</span>
                </div>
            </div>

            {!readonly && (
                <p className="text-[11px] text-slate-500 italic">
                    * Geser peta atau klik di mana saja pada peta untuk memperbarui titik koordinat dan mengisi alamat lengkap secara otomatis &amp; presisi.
                </p>
            )}
        </div>
    );
}
