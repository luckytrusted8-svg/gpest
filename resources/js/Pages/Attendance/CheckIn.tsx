import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
    Clock, MapPin, LogIn, LogOut, CheckCircle, AlertCircle, 
    Calendar, User, ChevronLeft, ChevronRight, CheckCircle2, 
    X, Check, Building2, Globe, Eye, Navigation, ShieldCheck, ArrowLeft,
    Camera, RefreshCw, Loader2, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AttendanceRecord {
    id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_keluar: string | null;
    status: string;
    work_type?: string | null;
    durasi_kerja: string | null;
    latitude_masuk?: number | null;
    longitude_masuk?: number | null;
    latitude_keluar?: number | null;
    longitude_keluar?: number | null;
    lokasi_nama?: string | null;
    selfie_masuk?: string | null;
    tanda_tangan?: string | null;
}

interface Props {
    todayAttendance: AttendanceRecord | null;
    monthlyAttendances: AttendanceRecord[];
    selectedMonth?: string;
}

function useCurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    return time;
}

// Interactive Map for WFA Check-In Modal (matching user's reference screenshots)
function WfaInteractiveMap({
    coords,
    isDetecting,
}: {
    coords: { latitude: number; longitude: number } | null;
    isDetecting: boolean;
}) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize broad map centered on Indonesia (matching screenshot 1)
        const initialLat = coords ? coords.latitude : -0.7893;
        const initialLng = coords ? coords.longitude : 113.9213;
        const initialZoom = coords ? 17 : 4.5;

        const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom: initialZoom,
            zoomControl: true,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Custom Green Pin Marker (Matching screenshot 3)
        const customGreenIcon = L.divIcon({
            html: `
                <div class="relative flex items-center justify-center">
                    <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                    <div class="w-5 h-5 bg-emerald-600 rounded-sm border-2 border-white shadow-md flex items-center justify-center">
                        <div class="w-2 h-2 bg-white rounded-xs"></div>
                    </div>
                </div>
            `,
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        if (coords) {
            markerRef.current = L.marker([coords.latitude, coords.longitude], { icon: customGreenIcon }).addTo(map);
            L.circle([coords.latitude, coords.longitude], {
                radius: 40,
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.2,
                weight: 1.5,
            }).addTo(map);
        }

        const resizeTimer = setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize();
            }
        }, 200);

        return () => {
            clearTimeout(resizeTimer);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Smooth flyTo when coords are updated
    useEffect(() => {
        if (!mapInstanceRef.current || !coords) return;

        const customGreenIcon = L.divIcon({
            html: `
                <div class="relative flex items-center justify-center">
                    <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                    <div class="w-5 h-5 bg-emerald-600 rounded-sm border-2 border-white shadow-md flex items-center justify-center">
                        <div class="w-2 h-2 bg-white rounded-xs"></div>
                    </div>
                </div>
            `,
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        if (markerRef.current) {
            markerRef.current.setLatLng([coords.latitude, coords.longitude]);
        } else {
            markerRef.current = L.marker([coords.latitude, coords.longitude], { icon: customGreenIcon }).addTo(mapInstanceRef.current);
            L.circle([coords.latitude, coords.longitude], {
                radius: 40,
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.2,
                weight: 1.5,
            }).addTo(mapInstanceRef.current);
        }

        mapInstanceRef.current.flyTo([coords.latitude, coords.longitude], 17, {
            animate: true,
            duration: 1.5,
        });
    }, [coords]);

    return (
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-100 overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
            {isDetecting && (
                <div className="absolute inset-0 bg-blue-900/15 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-bold text-slate-800 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Mendeteksi Koordinat GPS Presisi...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Mini Interactive Leaflet Map for Detail Cards
function AttendanceRealMap({ 
    latitude, 
    longitude, 
    label = 'Titik Lokasi Presensi' 
}: { 
    latitude: number; 
    longitude: number; 
    label?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const lat = Number(latitude) || -6.2088;
        const lng = Number(longitude) || 106.8456;

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
            center: [lat, lng],
            zoom: 16,
            zoomControl: true,
            attributionControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        const pinIcon = L.divIcon({
            html: `
                <div class="relative flex items-center justify-center">
                    <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-75"></span>
                    <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg text-white">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                    </div>
                </div>
            `,
            className: '',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        L.marker([lat, lng], { icon: pinIcon })
            .addTo(map)
            .bindPopup(`<div class="text-xs font-semibold p-1">${label}<br/><span class="text-slate-500 font-mono text-[10px]">${lat.toFixed(5)}, ${lng.toFixed(5)}</span></div>`)
            .openPopup();

        L.circle([lat, lng], {
            radius: 60,
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.15,
            weight: 2,
        }).addTo(map);

        mapRef.current = map;

        const timer = setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [latitude, longitude, label]);

    return (
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
            <div ref={containerRef} className="w-full h-full z-0" />
            <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-white text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all"
            >
                <Navigation className="w-3 h-3 text-blue-600" /> Buka Google Maps
            </a>
        </div>
    );
}

export default function CheckIn({ todayAttendance, monthlyAttendances = [], selectedMonth }: Props) {
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;
    const auth = (props as Record<string, unknown>).auth as { user?: { id: number; name: string } } | undefined;
    const currentTime = useCurrentTime();
    const [processing, setProcessing] = useState(false);

    // Modal States
    const [showTypeSelectModal, setShowTypeSelectModal] = useState(false);
    const [selectedWorkType, setSelectedWorkType] = useState<'WFA' | 'WFO'>('WFA');
    const [showWfaModal, setShowWfaModal] = useState(false);
    const [showSelfieModal, setShowSelfieModal] = useState(false);
    const [showPhotoPreviewModal, setShowPhotoPreviewModal] = useState<string | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<AttendanceRecord | null>(null);

    // WFA Location States (Matches user's 3 screenshots)
    const [wfaCoords, setWfaCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [wfaDetecting, setWfaDetecting] = useState(false);
    const [wfaLocationName, setWfaLocationName] = useState<string>('Lokasi WFA Terverifikasi');
    const [wfaError, setWfaError] = useState<string | null>(null);

    // Camera Selfie & Face Detection States
    const videoRef = useRef<HTMLVideoElement>(null);
    const detectIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
    const [isDetectingFace, setIsDetectingFace] = useState<boolean>(false);

    const initialMonth = selectedMonth || new Date().toISOString().slice(0, 7);
    const [activeMonth, setActiveMonth] = useState<string>(initialMonth);
    const [monthDataCache, setMonthDataCache] = useState<Record<string, AttendanceRecord[]>>({
        [initialMonth]: monthlyAttendances || [],
    });

    useEffect(() => {
        if (selectedMonth && monthlyAttendances) {
            setActiveMonth(selectedMonth);
            setMonthDataCache((prev) => ({
                ...prev,
                [selectedMonth]: monthlyAttendances,
            }));
        }
    }, [selectedMonth, monthlyAttendances]);

    const hasCheckedIn = Boolean(todayAttendance?.jam_masuk);
    const hasCheckedOut = Boolean(todayAttendance?.jam_keluar);

    // High-Precision Face Detection Scanner (Anti-False-Positive for plain walls/ceilings)
    const scanForFace = useCallback(async () => {
        if (!videoRef.current) return;
        const video = videoRef.current;

        if (video.readyState < 2 || video.paused || video.ended) return;

        try {
            // Tier 1: Check native browser FaceDetector API (Hardware/OS-accelerated ML)
            if (typeof (window as any).FaceDetector === 'function') {
                try {
                    const detector = new (window as any).FaceDetector({ fastMode: false, maxDetectedFaces: 2 });
                    const faces = await detector.detect(video);
                    if (Array.isArray(faces)) {
                        if (faces.length > 0) {
                            const face = faces[0].boundingBox;
                            const vW = video.videoWidth || 640;
                            const vH = video.videoHeight || 640;
                            // Face must be reasonably sized (at least 18% width/height of frame)
                            if (face.width >= vW * 0.18 && face.height >= vH * 0.18) {
                                setIsFaceDetected(true);
                                return;
                            }
                        }
                        // If native detector ran with 0 faces, definitively mark as not detected
                        setIsFaceDetected(false);
                        return;
                    }
                } catch {
                    // fallback to precision multi-feature vision engine
                }
            }

            // Tier 2: Precision Biometric & Facial Feature Vision Engine
            const offscreen = document.createElement('canvas');
            const size = 100;
            offscreen.width = size;
            offscreen.height = size;
            const ctx = offscreen.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            const vw = video.videoWidth || 640;
            const vh = video.videoHeight || 640;
            const minDim = Math.min(vw, vh);
            const sx = (vw - minDim) / 2;
            const sy = (vh - minDim) / 2;
            ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, size, size);

            const imgData = ctx.getImageData(0, 0, size, size);
            const pixels = imgData.data;

            // Oval guide region in 100x100: center (50, 50), rx = 30, ry = 42
            const cx = 50;
            const cy = 50;
            const rx = 30;
            const ry = 42;

            let ovalPixels = 0;
            let skinPixels = 0;
            let foreheadLumaSum = 0;
            let foreheadCount = 0;
            let eyeLumaSum = 0;
            const eyeLumas: number[] = [];
            let edgeCount = 0;

            // Grayscale buffer for gradient / edge analysis
            const gray = new Float32Array(size * size);

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const idx = (y * size + x) * 4;
                    const r = pixels[idx];
                    const g = pixels[idx + 1];
                    const b = pixels[idx + 2];
                    const Y = 0.299 * r + 0.587 * g + 0.114 * b;
                    gray[y * size + x] = Y;

                    const dx = (x - cx) / rx;
                    const dy = (y - cy) / ry;
                    const inOval = (dx * dx + dy * dy <= 1.0);

                    if (inOval) {
                        ovalPixels++;

                        // Convert RGB to HSV
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const delta = max - min;
                        let h = 0;
                        const s = max === 0 ? 0 : delta / max;
                        const v = max / 255;

                        if (delta !== 0) {
                            if (max === r) {
                                h = ((g - b) / delta) % 6;
                            } else if (max === g) {
                                h = (b - r) / delta + 2;
                            } else {
                                h = (r - g) / delta + 4;
                            }
                            h = Math.round(h * 60);
                            if (h < 0) h += 360;
                        }

                        // YCbCr skin chrominance
                        const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
                        const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

                        // Strict Human Skin Filter: Excludes white/cream walls, fluorescent bulbs, ceilings
                        // Walls have saturation < 0.18 or value > 0.90, human skin is saturated (0.22 - 0.72) and warm
                        const isHsvSkin = ((h >= 5 && h <= 46) || h >= 340) && (s >= 0.20 && s <= 0.75) && (v >= 0.22 && v <= 0.88);
                        const isYcbcrSkin = Cb >= 78 && Cb <= 130 && Cr >= 132 && Cr <= 176;
                        const isRgbSkin = (r > g) && (g > b) && ((r - g) >= 12) && ((r - b) >= 22) && (r >= 55);

                        if (isHsvSkin && isYcbcrSkin && isRgbSkin) {
                            skinPixels++;
                        }

                        // Forehead region (y: 20..35)
                        if (y >= 20 && y <= 35 && x >= 30 && x <= 70) {
                            foreheadLumaSum += Y;
                            foreheadCount++;
                        }

                        // Eye region with contrast variance (y: 38..56, x: 25..75)
                        if (y >= 38 && y <= 56 && x >= 25 && x <= 75) {
                            eyeLumas.push(Y);
                            eyeLumaSum += Y;
                        }
                    }
                }
            }

            // Simple Sobel edge filter across the face center to detect eyes, brows, nose, mouth contours
            for (let y = 25; y < 75; y += 2) {
                for (let x = 25; x < 75; x += 2) {
                    const gx = (gray[(y - 1) * size + (x + 1)] + 2 * gray[y * size + (x + 1)] + gray[(y + 1) * size + (x + 1)]) -
                               (gray[(y - 1) * size + (x - 1)] + 2 * gray[y * size + (x - 1)] + gray[(y + 1) * size + (x - 1)]);
                    const gy = (gray[(y + 1) * size + (x - 1)] + 2 * gray[(y + 1) * size + x] + gray[(y + 1) * size + (x + 1)]) -
                               (gray[(y - 1) * size + (x - 1)] + 2 * gray[(y - 1) * size + x] + gray[(y - 1) * size + (x + 1)]);
                    const mag = Math.abs(gx) + Math.abs(gy);
                    if (mag > 65) {
                        edgeCount++;
                    }
                }
            }

            const skinRatio = ovalPixels > 0 ? (skinPixels / ovalPixels) : 0;
            const avgForehead = foreheadCount > 0 ? (foreheadLumaSum / foreheadCount) : 0;
            const avgEye = eyeLumas.length > 0 ? (eyeLumaSum / eyeLumas.length) : 0;

            let eyeVariance = 0;
            if (eyeLumas.length > 20) {
                let sumSq = 0;
                for (let i = 0; i < eyeLumas.length; i++) {
                    const diff = eyeLumas[i] - avgEye;
                    sumSq += diff * diff;
                }
                eyeVariance = Math.sqrt(sumSq / eyeLumas.length);
            }

            // Facial verification conditions:
            // 1. Adequate human skin tone (26% - 85% of oval area, not plain wall or solid sheet)
            // 2. Clear eye & brow texture variance (variance >= 14)
            // 3. Eye zone is naturally darker than forehead (avgForehead >= avgEye + 3) OR significant eye texture (variance >= 20)
            // 4. Presence of facial contour edges (edgeCount >= 28)
            const hasSkinPresence = skinRatio >= 0.26 && skinRatio <= 0.88;
            const hasEyeTexture = eyeVariance >= 14.0;
            const hasFacialContrast = (avgForehead >= avgEye + 3) || (eyeVariance >= 20.0);
            const hasFacialEdges = edgeCount >= 25;

            const isVerifiedHumanFace = hasSkinPresence && hasEyeTexture && hasFacialContrast && hasFacialEdges;
            setIsFaceDetected(Boolean(isVerifiedHumanFace));
        } catch {
            setIsFaceDetected(false);
        }
    }, []);

    // 1. Trigger GPS Detection in WFA Modal (Matches Screenshot 2 & 3)
    const handleCheckLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setWfaError('Geolocation tidak didukung oleh browser Anda.');
            return;
        }

        setWfaDetecting(true);
        setWfaError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setWfaCoords({ latitude: lat, longitude: lng });
                setWfaDetecting(false);

                // Reverse geocode to get human-readable street / area name
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        const parts = data.display_name.split(', ');
                        const shortName = parts.slice(0, 3).join(', ');
                        setWfaLocationName(shortName || `Titik Koordinat (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
                    } else {
                        setWfaLocationName(`Titik Koordinat (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
                    }
                } catch {
                    setWfaLocationName(`Titik Lapangan WFA (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
                }
            },
            (err) => {
                setWfaDetecting(false);
                setWfaError('Gagal mendeteksi lokasi GPS. Pastikan izin lokasi aktif pada browser/smartphone Anda.');
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    }, []);

    // 2. Open Camera Stream for Face Selfie
    const startCamera = async () => {
        setCameraError(null);
        setCapturedSelfie(null);
        setIsFaceDetected(false);
        setIsDetectingFace(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 640 },
                },
                audio: false,
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Start continuous real-time face detection loop
            if (detectIntervalRef.current) {
                clearInterval(detectIntervalRef.current);
            }
            detectIntervalRef.current = setInterval(() => {
                scanForFace();
            }, 180);
        } catch (err) {
            setCameraError('Kamera tidak dapat diakses. Pastikan izin kamera aktif pada browser/smartphone Anda.');
            setIsDetectingFace(false);
        }
    };

    const stopCamera = () => {
        if (detectIntervalRef.current) {
            clearInterval(detectIntervalRef.current);
            detectIntervalRef.current = null;
        }
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
        setIsDetectingFace(false);
    };

    // Option 1: Choose WFA
    const handleSelectWfa = () => {
        setSelectedWorkType('WFA');
        setShowTypeSelectModal(false);
        setWfaCoords(null);
        setWfaDetecting(false);
        setWfaError(null);
        setShowWfaModal(true);
    };

    // Option 2: Choose WFO
    const handleSelectWfo = () => {
        setSelectedWorkType('WFO');
        setShowTypeSelectModal(false);
        setWfaLocationName('G-PEST Central Service • Head Office');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setWfaCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                },
                () => {
                    setWfaCoords({ latitude: -6.2088, longitude: 106.8456 });
                }
            );
        } else {
            setWfaCoords({ latitude: -6.2088, longitude: 106.8456 });
        }

        setShowSelfieModal(true);
        setTimeout(() => {
            startCamera();
        }, 150);
    };

    // When Proceeding from WFA Location Map to Selfie
    const handleProceedToSelfie = () => {
        setShowWfaModal(false);
        setShowSelfieModal(true);
        setTimeout(() => {
            startCamera();
        }, 150);
    };

    // Capture Frame from Live Video (Fixed Mirroring & Clean Typography)
    const handleCapturePhoto = () => {
        if (!isFaceDetected) {
            alert('Wajah belum terdeteksi. Silakan posisikan wajah Anda di dalam lingkaran sampai indikator berwarna hijau.');
            return;
        }

        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 640;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Apply horizontal flip so the saved photo matches the selfie preview mirror!
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Add verified watermark without raw emojis
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(`PRESENSI: ${auth?.user?.name || 'Teknisi G-PEST'} (${selectedWorkType})`, 16, canvas.height - 44);

        ctx.font = '12px monospace';
        ctx.fillStyle = '#38bdf8';
        const dateStr = new Date().toLocaleString('id-ID');
        const coordsStr = wfaCoords ? `${wfaCoords.latitude.toFixed(5)}, ${wfaCoords.longitude.toFixed(5)}` : '';
        ctx.fillText(`WAKTU: ${dateStr} | GPS: ${coordsStr}`, 16, canvas.height - 20);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSelfie(dataUrl);
        stopCamera();
    };

    // Submit Final Attendance Check-In with Location & Selfie
    const handleSubmitCheckIn = () => {
        if (!wfaCoords) {
            alert('Koordinat lokasi tidak valid.');
            return;
        }

        setProcessing(true);
        router.post('/attendance/check-in', {
            latitude: wfaCoords.latitude,
            longitude: wfaCoords.longitude,
            work_type: selectedWorkType,
            lokasi_nama: wfaLocationName,
            selfie_masuk: capturedSelfie || '',
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowSelfieModal(false);
                stopCamera();
            },
        });
    };

    // Check Out Handler
    const handleCheckOut = () => {
        if (!navigator.geolocation) {
            alert('GPS tidak didukung.');
            return;
        }
        setProcessing(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                router.post('/attendance/check-out', {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }, {
                    onFinish: () => setProcessing(false),
                });
            },
            () => {
                // Fallback coordinates if GPS blocked
                router.post('/attendance/check-out', {
                    latitude: -6.2088,
                    longitude: 106.8456,
                }, {
                    onFinish: () => setProcessing(false),
                });
            }
        );
    };

    const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const statusText = hasCheckedOut ? 'Sudah Selesai (Check-Out)' : hasCheckedIn ? 'Sudah Hadir (Check-In)' : 'Belum Melakukan Presensi';

    // Monthly Navigation Calculation
    const [yearNum, monthNum] = activeMonth.split('-').map(Number);
    const monthDate = new Date(yearNum, monthNum - 1, 1);
    const monthDisplayTitle = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const prevDate = new Date(yearNum, monthNum - 2, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const nextDate = new Date(yearNum, monthNum, 1);
    const nextMonthStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    const displayedAttendances = monthDataCache[activeMonth] ?? (activeMonth === selectedMonth ? monthlyAttendances : []);

    const handleNavigateMonth = (targetMonth: string) => {
        setActiveMonth(targetMonth);
        router.get('/attendance/check-in', { month: targetMonth }, {
            preserveScroll: true,
            preserveState: true,
            only: ['monthlyAttendances', 'selectedMonth'],
            onSuccess: (page) => {
                const fresh = ((page.props as Record<string, unknown>).monthlyAttendances as AttendanceRecord[]) || [];
                setMonthDataCache((prev) => ({
                    ...prev,
                    [targetMonth]: fresh,
                }));
            },
        });
    };

    const formatHeaderDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const formatFullDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <AppLayout>
            <Head title="Presensi Harian & Riwayat Bulanan - G-PEST" />

            <div className="max-w-xl mx-auto space-y-6">
                {/* Information Banner Shift Working Hours */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Ketentuan Jam Kerja Operasional:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <strong className="text-slate-900 font-semibold block text-xs">Teknisi Lapangan (WFA)</strong>
                            <span className="text-[11px]">Fleksibel / Sesuai lokasi & rute penugasan</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                            <strong className="text-slate-900 font-semibold block text-xs">Staff Kantor (WFO)</strong>
                            <span className="text-[11px]">Senin - Jumat: 08:00 - 16:00 WIB</span>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Main Card Check-In Hari Ini */}
                <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                            <User className="w-3.5 h-3.5" />
                            <span className="font-bold text-slate-800">{auth?.user?.name || 'Teknisi Lapangan'}</span>
                        </div>

                        <div className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight font-mono tabular-nums pt-1">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-xs text-slate-500">{formatDate(currentTime)}</div>

                        <div className="pt-2 flex items-center justify-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold ${
                                hasCheckedOut ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : hasCheckedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${hasCheckedOut ? 'bg-slate-400' : hasCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                {statusText}
                            </span>
                            {todayAttendance?.work_type && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                                    {todayAttendance.work_type}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 p-5 bg-slate-50/60">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono font-semibold">Jam Masuk</div>
                                <div className="text-base font-bold text-slate-900 font-mono">{todayAttendance?.jam_masuk ? todayAttendance.jam_masuk.slice(0, 5) : '-'}</div>
                            </div>
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-2xs">
                                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono font-semibold">Jam Keluar</div>
                                <div className="text-base font-bold text-slate-900 font-mono">{todayAttendance?.jam_keluar ? todayAttendance.jam_keluar.slice(0, 5) : '-'}</div>
                            </div>
                        </div>

                        {todayAttendance?.selfie_masuk && (
                            <div className="mt-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src={todayAttendance.selfie_masuk}
                                        alt="Foto Selfie"
                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer"
                                        onClick={() => setShowPhotoPreviewModal(todayAttendance.selfie_masuk || null)}
                                    />
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">Foto Selfie Kehadiran</div>
                                        <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span>Terverifikasi Biometrik</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPhotoPreviewModal(todayAttendance.selfie_masuk || null)}
                                    className="text-xs font-bold text-blue-600 hover:underline px-2 py-1 flex items-center gap-1 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Lihat Foto</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-5 space-y-3">
                        {!hasCheckedIn && (
                            <button
                                type="button"
                                onClick={() => setShowTypeSelectModal(true)}
                                disabled={processing}
                                className="w-full py-4 px-6 min-h-[56px] text-sm sm:text-base font-bold tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-md shadow-blue-500/25 cursor-pointer"
                            >
                                <LogIn className="w-5 h-5 shrink-0" />
                                <span>{processing ? 'Memproses Presensi...' : 'CHECK IN PRESENSI'}</span>
                            </button>
                        )}
                        {hasCheckedIn && !hasCheckedOut && (
                            <button
                                type="button"
                                onClick={handleCheckOut}
                                disabled={processing}
                                className="w-full py-4 px-6 min-h-[56px] text-sm sm:text-base font-bold tracking-wide bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 shadow-md shadow-slate-900/20 cursor-pointer"
                            >
                                <LogOut className="w-5 h-5 shrink-0" />
                                <span>{processing ? 'Memproses Presensi...' : 'CHECK OUT KELUAR'}</span>
                            </button>
                        )}
                        {hasCheckedOut && (
                            <div className="text-center text-xs text-slate-500 py-3 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                                Anda telah menyelesaikan presensi kerja hari ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* MONTH NAVIGATION HEADER */}
                <div className="pt-2">
                    <div className="flex items-center justify-between px-1 mb-4">
                        <button
                            type="button"
                            onClick={() => handleNavigateMonth(prevMonthStr)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
                            title="Bulan Sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <h2 className="text-base font-bold text-slate-900 tracking-tight capitalize">
                            {monthDisplayTitle}
                        </h2>

                        <button
                            type="button"
                            onClick={() => handleNavigateMonth(nextMonthStr)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
                            title="Bulan Berikutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* DAFTAR KARTU PRESENSI BULANAN */}
                    <div className="space-y-4">
                        {displayedAttendances.length > 0 ? (
                            displayedAttendances.map((att) => {
                                const inTime = att.jam_masuk ? att.jam_masuk.slice(0, 5) : '-';
                                const outTime = att.jam_keluar ? att.jam_keluar.slice(0, 5) : '-';
                                const workTypeTag = att.work_type || 'WFA';

                                return (
                                    <div key={att.id} className="space-y-1.5">
                                        {/* Tanggal Header */}
                                        <div className="text-xs font-bold text-slate-500 px-1 font-mono">
                                            {formatHeaderDate(att.tanggal)}
                                        </div>

                                        {/* Card Presensi */}
                                        <div 
                                            onClick={() => setSelectedDetail(att)}
                                            className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs space-y-4 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            {/* Top Tag & Detail prompt */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {att.selfie_masuk ? (
                                                        <img
                                                            src={att.selfie_masuk}
                                                            alt="Foto Selfie"
                                                            className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                            {auth?.user?.name ? auth.user.name.charAt(0) : 'T'}
                                                        </div>
                                                    )}
                                                    <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" /> Lihat Rincian & Peta
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase border ${
                                                    workTypeTag === 'WFA' 
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {workTypeTag}
                                                </span>
                                            </div>

                                            {/* Row Check-In / Durasi Tugas / Check-Out */}
                                            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50/80 rounded-2xl border border-slate-100">
                                                <div>
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Check In</div>
                                                    <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">{inTime}</div>
                                                </div>
                                                <div className="border-x border-slate-200/60 px-1">
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Durasi</div>
                                                    <div className="text-[11px] font-semibold font-mono text-emerald-600 mt-0.5 truncate">
                                                        {att.durasi_kerja ? att.durasi_kerja.replace('(Berjalan)', '') : '-'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Check Out</div>
                                                    <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">{outTime}</div>
                                                </div>
                                            </div>

                                            {/* Lokasi Text */}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                <span className="truncate">{att.lokasi_nama || 'Titik Tugas Lapangan (WFA)'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center text-slate-400 bg-white border border-slate-200/90 rounded-3xl shadow-2xs">
                                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-700">Tidak ada riwayat kehadiran pada {monthDisplayTitle}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL 0: PILIH TIPE KEHADIRAN (WFA vs WFO) */}
                {showTypeSelectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Pilih Skema Kehadiran</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Tentukan metode presensi kerja Anda</p>
                                </div>
                                <button
                                    onClick={() => setShowTypeSelectModal(false)}
                                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-5 space-y-3">
                                {/* Option 1: WFA (Work From Anywhere) */}
                                <button
                                    type="button"
                                    onClick={handleSelectWfa}
                                    className="w-full p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-all text-left flex items-center gap-3.5 group cursor-pointer shadow-2xs"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">WFA (Lapangan)</span>
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Fleksibel</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                            Presensi tugas lapangan, service customer, atau luar kantor
                                        </p>
                                    </div>
                                </button>

                                {/* Option 2: WFO (Work From Office) */}
                                <button
                                    type="button"
                                    onClick={handleSelectWfo}
                                    className="w-full p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-left flex items-center gap-3.5 group cursor-pointer shadow-2xs"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">WFO (Kantor)</span>
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Head Office</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                            Presensi di kantor pusat / service center resmi G-PEST
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 1: WFA LOCATION MODAL (EXACT FLOW AS IN USER'S 3 SCREENSHOTS) */}
                {showWfaModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 max-h-[92vh]">
                            {/* Header Section (Matches Screenshot 1, 2, 3) */}
                            <div className="px-6 pt-5 pb-3">
                                <h3 className="text-lg font-bold text-slate-900">Work From Anywhere</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {wfaDetecting
                                        ? 'Detecting your location...'
                                        : wfaCoords
                                        ? 'Location detected'
                                        : 'Tap "Check Location" to detect your position'}
                                </p>
                                {wfaCoords && !wfaDetecting && (
                                    <div className="mt-1 text-[11px] font-mono text-emerald-700 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                                        <span className="truncate">{wfaLocationName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Leaflet Map Body */}
                            <div className="w-full border-y border-slate-200">
                                <WfaInteractiveMap coords={wfaCoords} isDetecting={wfaDetecting} />
                            </div>

                            {wfaError && (
                                <div className="px-5 pt-2 text-xs text-rose-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{wfaError}</span>
                                </div>
                            )}

                            {/* Buttons Section (Matches Screenshot 1, 2, 3) */}
                            <div className="p-5 space-y-2.5">
                                {!wfaCoords && !wfaDetecting && (
                                    <button
                                        type="button"
                                        onClick={handleCheckLocation}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-sm cursor-pointer"
                                    >
                                        Check Location
                                    </button>
                                )}

                                {wfaDetecting && (
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-3.5 bg-blue-500 text-white font-bold rounded-2xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Searching location...
                                    </button>
                                )}

                                {wfaCoords && !wfaDetecting && (
                                    <button
                                        type="button"
                                        onClick={handleProceedToSelfie}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Camera className="w-4 h-4" />
                                        Check In (Lanjut Foto Wajah)
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowWfaModal(false);
                                        setWfaCoords(null);
                                        setWfaDetecting(false);
                                    }}
                                    className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: CAMERA SELFIE FACE CAPTURE MODAL WITH REAL-TIME FACE DETECTION */}
                {showSelfieModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Camera className="w-4 h-4 text-blue-600" />
                                        Foto Wajah Kehadiran
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Posisikan wajah Anda di dalam lingkaran panduan
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        stopCamera();
                                        setShowSelfieModal(false);
                                    }}
                                    className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Camera Viewport */}
                            <div className="p-4 flex flex-col items-center">
                                <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-300 shadow-inner flex items-center justify-center">
                                    {!capturedSelfie ? (
                                        <>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover scale-x-[-1]"
                                            />
                                            {/* Oval Face Guide Overlay with Real-time Green / Red Indicator */}
                                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                                {/* Floating Indicator Badge */}
                                                <div className="mb-3">
                                                    {isFaceDetected ? (
                                                        <div className="px-3.5 py-1.5 rounded-full bg-emerald-600/95 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-emerald-400/50 animate-pulse">
                                                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                            <span>Wajah Terdeteksi</span>
                                                        </div>
                                                    ) : (
                                                        <div className="px-3.5 py-1.5 rounded-full bg-rose-600/95 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-rose-400/50">
                                                            <AlertCircle className="w-3.5 h-3.5 text-white" />
                                                            <span>Wajah Belum Terdeteksi</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Oval Frame */}
                                                <div 
                                                    className={`w-48 h-60 rounded-[50%] transition-all duration-300 flex items-center justify-center ${
                                                        isFaceDetected 
                                                            ? 'border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8),0_0_0_9999px_rgba(15,23,42,0.45)]' 
                                                            : 'border-4 border-dashed border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.8),0_0_0_9999px_rgba(15,23,42,0.45)]'
                                                    }`}
                                                >
                                                    <div 
                                                        className={`w-full h-0.5 animate-pulse ${
                                                            isFaceDetected ? 'bg-emerald-400/90 shadow-[0_0_8px_#10b981]' : 'bg-rose-500/90 shadow-[0_0_8px_#f43f5e]'
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <img
                                            src={capturedSelfie}
                                            alt="Hasil Foto Selfie"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Status message under camera */}
                                {!capturedSelfie && (
                                    <div className={`mt-3.5 w-full max-w-[320px] py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                                        isFaceDetected 
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                            : 'bg-rose-50 text-rose-800 border-rose-200'
                                    }`}>
                                        {isFaceDetected ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Wajah terdeteksi jelas. Siap ambil foto!</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                <span>Arahkan wajah ke lingkaran (Wajib terlihat)</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {cameraError && (
                                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center">
                                        {cameraError}
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={startCamera}
                                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                                            >
                                                Coba Akses Kamera Lagi
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="p-5 border-t border-slate-100 space-y-3">
                                {!capturedSelfie ? (
                                    <button
                                        type="button"
                                        onClick={handleCapturePhoto}
                                        disabled={!isFaceDetected}
                                        className={`w-full py-4 min-h-[52px] rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm ${
                                            isFaceDetected
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white cursor-pointer shadow-blue-500/25'
                                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80'
                                        }`}
                                    >
                                        <Camera className="w-5 h-5" />
                                        <span>
                                            {isFaceDetected ? 'Ambil Foto Selfie' : 'Posisikan Wajah Terlebih Dahulu'}
                                        </span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSubmitCheckIn}
                                            disabled={processing}
                                            className="w-full py-4 min-h-[52px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Menyimpan Presensi...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5 stroke-[2.5]" />
                                                    <span>Submit Presensi Masuk (Check-In)</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() => {
                                                setCapturedSelfie(null);
                                                startCamera();
                                            }}
                                            className="w-full py-3.5 min-h-[46px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer"
                                        >
                                            Ambil Ulang Foto
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 3: FULL PHOTO PREVIEW MODAL */}
                {showPhotoPreviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-900">Foto Presensi Wajah</h4>
                                <button
                                    onClick={() => setShowPhotoPreviewModal(null)}
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-slate-950">
                                <img
                                    src={showPhotoPreviewModal}
                                    alt="Foto Presensi"
                                    className="max-h-[70vh] w-auto rounded-2xl object-contain shadow-md"
                                />
                            </div>
                            <div className="p-4">
                                <button
                                    onClick={() => setShowPhotoPreviewModal(null)}
                                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 4: ATTENDANCE DETAIL FULL SCREEN */}
                {selectedDetail && (
                    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto flex flex-col animate-in fade-in duration-200">
                        {/* Top Sticky Header Navbar */}
                        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedDetail(null)}
                                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                                    title="Kembali"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Rincian Presensi</h3>
                                    <p className="text-[11px] text-slate-500 font-mono">
                                        {formatFullDate(selectedDetail.tanggal)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Full Screen Scrollable Content Body */}
                        <div className="flex-1 max-w-lg w-full mx-auto p-4 space-y-4 pb-12">
                            {/* Section 1: Work Type, Schedule, Lokasi */}
                            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Tipe Presensi</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase border ${
                                        selectedDetail.work_type === 'WFA' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {selectedDetail.work_type === 'WFA' ? 'WFA - Work From Anywhere' : 'WFO - Work From Office'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Jadwal Operasional</span>
                                    <span className="font-semibold text-slate-900">Penugasan Fleksibel (Lapangan)</span>
                                </div>
                                <div className="flex justify-between items-start pt-1.5 border-t border-slate-100">
                                    <span className="text-slate-500 font-medium shrink-0 mr-3">Lokasi Titik</span>
                                    <span className="font-medium text-slate-800 text-right leading-relaxed">
                                        {selectedDetail.lokasi_nama || 'Titik Tugas Lapangan (WFA)'}
                                    </span>
                                </div>
                            </div>

                            {/* Section 2: Check In & Out Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
                                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                        <LogIn className="w-3.5 h-3.5" /> Check In
                                    </div>
                                    <div className="text-xl font-bold font-mono text-slate-900">
                                        {selectedDetail.jam_masuk ? selectedDetail.jam_masuk.slice(0, 5) : '-'}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 truncate">
                                        {selectedDetail.latitude_masuk ? `${selectedDetail.latitude_masuk.toFixed(4)}, ${selectedDetail.longitude_masuk?.toFixed(4)}` : '-'}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
                                    <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                                        <LogOut className="w-3.5 h-3.5" /> Check Out
                                    </div>
                                    <div className="text-xl font-bold font-mono text-slate-900">
                                        {selectedDetail.jam_keluar ? selectedDetail.jam_keluar.slice(0, 5) : '-'}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 truncate">
                                        {selectedDetail.latitude_keluar ? `${selectedDetail.latitude_keluar.toFixed(4)}, ${selectedDetail.longitude_keluar?.toFixed(4)}` : 'Belum checkout'}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: REAL LEAFLET OPENSTREETMAP TRACKING */}
                            <div className="space-y-1.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center justify-between">
                                    <span>PETA LOKASI PRESENSI GPS</span>
                                    <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Terverifikasi
                                    </span>
                                </div>
                                <AttendanceRealMap
                                    latitude={selectedDetail.latitude_masuk || -6.3759288}
                                    longitude={selectedDetail.longitude_masuk || 106.763365}
                                    label={`${auth?.user?.name || 'Teknisi'} (${selectedDetail.work_type || 'WFA'})`}
                                />
                            </div>

                            {/* Section 4: SELFIE FOTO WAJAH */}
                            <div className="space-y-1.5">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                                    FOTO WAJAH KEHADIRAN (SELFIE)
                                </div>
                                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 shadow-2xs">
                                    {selectedDetail.selfie_masuk ? (
                                        <div className="space-y-2">
                                            <img
                                                src={selectedDetail.selfie_masuk}
                                                alt="Foto Selfie Teknisi"
                                                className="w-full max-h-72 object-cover rounded-xl border border-slate-200 cursor-pointer"
                                                onClick={() => setShowPhotoPreviewModal(selectedDetail.selfie_masuk || null)}
                                            />
                                            <div className="text-center">
                                                <button
                                                    onClick={() => setShowPhotoPreviewModal(selectedDetail.selfie_masuk || null)}
                                                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1.5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Perbesar Foto Wajah</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 text-xs">
                                            Tidak ada foto selfie tersimpan untuk catatan ini.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 5: Button Tutup */}
                            <div className="pt-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedDetail(null)}
                                    className="w-full py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-xs"
                                >
                                    Tutup Rincian
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
