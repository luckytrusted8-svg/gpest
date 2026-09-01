import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Clock, RefreshCw, History, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { TeknisiData, GeofenceData } from '@/Components/TrackingMap';

const TrackingMap = React.lazy(() => import('@/Components/TrackingMap'));

interface Props {
    technicians?: TeknisiData[];
    geofences?: GeofenceData[];
    selectedDate?: string;
}

interface MapErrorBoundaryState {
    hasError: boolean;
}

class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, MapErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: unknown) {
        console.error('TrackingMap render error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-[600px] w-full flex flex-col items-center justify-center bg-canvas-soft border border-hairline rounded-lg p-6 text-center">
                    <p className="text-body-md font-medium text-ink mb-2">Gagal memuat peta interaktif.</p>
                    <p className="text-body-sm text-mute mb-4">Silakan muat ulang atau periksa koneksi internet.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-primary text-white rounded-md text-body-sm font-medium hover:bg-primary-hover transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const statusLabels: Record<string, string> = {
    aktif: 'Aktif',
    dalam_perjalanan: 'Dalam Perjalanan',
    tiba: 'Tiba',
    bekerja: 'Bekerja',
    offline: 'Offline',
};

const statusDotColors: Record<string, string> = {
    aktif: 'bg-[#16a34a]',
    dalam_perjalanan: 'bg-[#2563eb]',
    tiba: 'bg-[#7928ca]',
    bekerja: 'bg-[#f5a623]',
    offline: 'bg-[#888888]',
};

const statusTextColors: Record<string, string> = {
    aktif: 'text-[#16a34a]',
    dalam_perjalanan: 'text-[#2563eb]',
    tiba: 'text-[#7928ca]',
    bekerja: 'text-[#f5a623]',
    offline: 'text-[#888888]',
};

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
    return '-';
}

export default function TrackingIndex({
    technicians = [],
    geofences = [],
    selectedDate = new Date().toISOString().split('T')[0],
}: Props) {
    const [data, setData] = useState<TeknisiData[]>(technicians);
    const [filterDate, setFilterDate] = useState(selectedDate);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        setData(technicians);
    }, [technicians]);

    const refreshData = useCallback(async () => {
        try {
            const res = await fetch(`/tracking/status?date=${filterDate}`, {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (res.ok) {
                const tracks = await res.json();
                setData((prev) => {
                    return prev.map((tech) => {
                        const track = tracks.find((t: Record<string, unknown>) => {
                            const techId = t.technician_id ?? (t.technician as Record<string, unknown>)?.id;
                            return techId === tech.id;
                        });
                        if (track) {
                            return {
                                ...tech,
                                latitude: track.latitude,
                                longitude: track.longitude,
                                status_teknisi: track.status_teknisi,
                                last_update: track.created_at,
                            };
                        }
                        return tech;
                    });
                });
            }
        } catch {
            // silent
        }
    }, [filterDate]);

    useEffect(() => {
        refreshData();
        intervalRef.current = setInterval(refreshData, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refreshData]);

    const handleDateChange = (date: string) => {
        setFilterDate(date);
        setLoading(true);
        router.get('/tracking', { date }, {
            preserveState: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    const onlineCount = data.filter((t) => t.status_teknisi !== 'offline').length;
    const offlineCount = data.filter((t) => t.status_teknisi === 'offline').length;

    return (
        <AppLayout>
            <Head title="Pelacakan Real-time" />

            <div className="max-w-[1600px] mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Pelacakan Real-time</h1>
                        <p className="text-body-sm text-mute mt-1">Monitor posisi seluruh teknisi di lapangan.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button
                            onClick={() => refreshData()}
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="text-body-sm-strong flex items-center gap-2"
                            onClick={() => router.get('/tracking/history')}
                        >
                            <History className="w-4 h-4" />
                            Riwayat
                        </Button>
                        <Button
                            variant="outline"
                            className="text-body-sm-strong flex items-center gap-2"
                            onClick={() => router.get('/geofences')}
                        >
                            <Layers className="w-4 h-4" />
                            Geofence
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 min-h-[600px] rounded-lg overflow-hidden border border-hairline shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] bg-canvas">
                        <MapErrorBoundary>
                            {isClient ? (
                                <Suspense
                                    fallback={
                                        <div className="h-[600px] w-full flex items-center justify-center bg-canvas text-mute text-body-sm">
                                            Memuat peta...
                                        </div>
                                    }
                                >
                                    <TrackingMap data={data} geofences={geofences} />
                                </Suspense>
                            ) : (
                                <div className="h-[600px] w-full flex items-center justify-center bg-canvas text-mute text-body-sm">
                                    Memuat peta...
                                </div>
                            )}
                        </MapErrorBoundary>
                    </div>

                    <div className="w-full lg:w-80 bg-canvas border border-hairline rounded-lg shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden shrink-0">
                        <div className="p-4 border-b border-hairline">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-body-md-strong text-ink">Status Teknisi</h2>
                                <div className="flex items-center gap-1 text-[11px]">
                                    <span className="text-[#16a34a] font-medium">{onlineCount} online</span>
                                    <span className="text-mute">/</span>
                                    <span className="text-mute font-medium">{offlineCount} offline</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <span key={key} className="inline-flex items-center gap-1 text-[11px] text-mute">
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[key]}`} />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[500px] divide-y divide-hairline">
                            {data
                                .sort((a, b) => {
                                    const order: Record<string, number> = { offline: 5, aktif: 0, dalam_perjalanan: 1, tiba: 2, bekerja: 3 };
                                    return (order[a.status_teknisi] ?? 4) - (order[b.status_teknisi] ?? 4);
                                })
                                .map((tech) => (
                                    <div key={tech.id} className="px-4 py-3 hover:bg-canvas-soft/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-[10px] font-bold text-ink shrink-0">
                                                    {tech.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-body-sm font-medium text-ink">{tech.name}</div>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[tech.status_teknisi]}`} />
                                                        <span className={`text-[11px] ${statusTextColors[tech.status_teknisi]}`}>
                                                            {statusLabels[tech.status_teknisi]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {tech.schedule && (
                                                    <div className="text-[10px] text-mute">{tech.schedule.schedule_code}</div>
                                                )}
                                                <div className="text-[10px] text-mute flex items-center gap-1 justify-end mt-0.5">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {timeAgo(tech.last_update)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
