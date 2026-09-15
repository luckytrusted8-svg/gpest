import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import {
    ArrowLeft,
    FileText,
    Camera,
    ClipboardList,
    Wrench,
    ZoomIn,
    X,
    ExternalLink,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const WorkReportStatusBadge = ({ status }: { status: WorkReport['status'] | string }) => {
    const map: Record<string, { label: string; badgeClass: string }> = {
        draft: { label: 'Draft', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
        dikirim: { label: 'Dikirim', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
        disetujui: { label: 'Disetujui', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        revisi: { label: 'Perlu Revisi', badgeClass: 'bg-orange-50 text-orange-700 border-orange-200' },
        selesai: { label: 'Selesai', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    };
    const { label, badgeClass } = map[status] ?? { label: status, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
            {label}
        </span>
    );
};

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    customer?: {
        id: number;
        customer_id: string;
        company_name: string;
    };
}

interface Photo {
    id: number;
    jenis_foto: 'sebelum' | 'selama' | 'sesudah';
    path_foto: string;
    keterangan: string | null;
}

interface WorkReport {
    id: number;
    nomor_laporan: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string | null;
    jenis_layanan: string;
    jenis_hama: string | null;
    metode_treatment: string | null;
    bahan_kimia: string | null;
    jumlah_bahan: string | null;
    area_treatment: string | null;
    peralatan: string | null;
    temuan: string | null;
    aktivitas_hama: string | null;
    tingkat_keparahan: string | null;
    rekomendasi: string | null;
    status: 'draft' | 'dikirim' | 'disetujui' | 'revisi' | 'selesai';
    catatan_supervisor: string | null;
    technician?: { name: string };
    contract?: { contract_number: string };
    schedule?: { schedule_code: string };
    photos: Photo[];
}

interface Props {
    customerUser: CustomerUser;
    workReport: WorkReport;
}

export default function WorkReportShow({ customerUser, workReport }: Props) {
    const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActivePhoto(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const photosBefore = workReport.photos.filter((p) => p.jenis_foto === 'sebelum');
    const photosDuring = workReport.photos.filter((p) => p.jenis_foto === 'selama');
    const photosAfter = workReport.photos.filter((p) => p.jenis_foto === 'sesudah');

    const photoCategories = [
        {
            key: 'sebelum' as const,
            title: 'Sebelum Treatment',
            badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
            dotClass: 'bg-blue-500',
            photos: photosBefore,
        },
        {
            key: 'selama' as const,
            title: 'Selama Treatment',
            badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
            dotClass: 'bg-amber-500',
            photos: photosDuring,
        },
        {
            key: 'sesudah' as const,
            title: 'Sesudah Treatment',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            dotClass: 'bg-emerald-500',
            photos: photosAfter,
        },
    ];

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <div className="text-caption-mono uppercase text-mute mb-1 text-[11px]">{label}</div>
            <div className="text-body-sm text-body-text font-medium">{value || <span className="text-mute italic font-normal">–</span>}</div>
        </div>
    );

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title={`Detail Laporan: ${workReport.nomor_laporan}`} />

            <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                        <Link href="/portal/work-reports">
                            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 mt-0.5 sm:mt-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-ink font-mono">{workReport.nomor_laporan}</h1>
                                <WorkReportStatusBadge status={workReport.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">
                                {workReport.jenis_layanan} — {workReport.tanggal}
                            </p>
                        </div>
                    </div>
                    <Link href="/portal/work-reports" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto text-body-sm-strong">
                            Kembali ke Daftar Laporan
                        </Button>
                    </Link>
                </div>

                {/* Informasi Pekerjaan */}
                <div className="bg-canvas border border-hairline rounded-xl shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-5 sm:p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mute" /> Informasi Pekerjaan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        <InfoRow label="Nomor Laporan" value={<span className="font-mono font-medium text-ink">{workReport.nomor_laporan}</span>} />
                        <InfoRow label="Tanggal Kunjungan" value={workReport.tanggal} />
                        <InfoRow label="Waktu Pekerjaan" value={`${workReport.jam_mulai}${workReport.jam_selesai ? ' – ' + workReport.jam_selesai : ''}`} />
                        <InfoRow label="Teknisi Penanggung Jawab" value={workReport.technician?.name} />
                        <InfoRow label="Nomor Kontrak" value={workReport.contract?.contract_number} />
                        <InfoRow label="Kode Jadwal" value={workReport.schedule?.schedule_code} />
                    </div>
                </div>

                {/* Hasil Inspeksi */}
                <div className="bg-canvas border border-hairline rounded-xl shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-5 sm:p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-mute" /> Hasil Inspeksi Lapangan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        <InfoRow label="Aktivitas Hama" value={workReport.aktivitas_hama} />
                        <InfoRow label="Tingkat Keparahan" value={workReport.tingkat_keparahan} />
                    </div>
                    {workReport.temuan && (
                        <div className="pt-2 border-t border-hairline/60">
                            <InfoRow label="Temuan Inspeksi" value={<p className="text-body-text whitespace-pre-line leading-relaxed">{workReport.temuan}</p>} />
                        </div>
                    )}
                    {workReport.rekomendasi && (
                        <div className="pt-2 border-t border-hairline/60">
                            <InfoRow label="Rekomendasi Teknisi" value={<p className="text-body-text whitespace-pre-line leading-relaxed">{workReport.rekomendasi}</p>} />
                        </div>
                    )}
                </div>

                {/* Detail Treatment */}
                <div className="bg-canvas border border-hairline rounded-xl shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-5 sm:p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-mute" /> Detail Treatment Pest Control
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        <InfoRow label="Jenis Layanan" value={workReport.jenis_layanan} />
                        <InfoRow label="Target Hama" value={workReport.jenis_hama} />
                        <InfoRow label="Metode Treatment" value={workReport.metode_treatment} />
                        <InfoRow label="Bahan Kimia" value={workReport.bahan_kimia} />
                        <InfoRow label="Jumlah Bahan" value={workReport.jumlah_bahan} />
                        <InfoRow label="Peralatan" value={workReport.peralatan} />
                    </div>
                    {workReport.area_treatment && (
                        <div className="pt-2 border-t border-hairline/60">
                            <InfoRow label="Area Treatment" value={<p className="text-body-text whitespace-pre-line leading-relaxed">{workReport.area_treatment}</p>} />
                        </div>
                    )}
                </div>

                {/* Dokumentasi Foto */}
                {workReport.photos && workReport.photos.length > 0 && (
                    <div className="bg-canvas border border-hairline rounded-xl shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-5 sm:p-6 space-y-6">
                        <div className="border-b border-hairline pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h2 className="text-body-sm-strong text-ink uppercase tracking-wide flex items-center gap-2">
                                <Camera className="w-4 h-4 text-mute" /> Foto Dokumentasi Pekerjaan ({workReport.photos.length})
                            </h2>
                            <span className="text-xs text-mute font-medium">Klik foto untuk melihat dalam resolusi penuh</span>
                        </div>

                        {/* Grid 3 Kolom Proporsional di Desktop (Sebelum, Selama, Sesudah), Stacked 1 Kolom di Mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {photoCategories.map((category) => (
                                <div
                                    key={category.key}
                                    className="bg-canvas-soft/60 border border-hairline rounded-xl p-4 sm:p-5 flex flex-col space-y-4"
                                >
                                    {/* Header Kolom Kategori */}
                                    <div className="flex items-center justify-between gap-2 border-b border-hairline/80 pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${category.dotClass}`}></span>
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                                                {category.title}
                                            </h3>
                                        </div>
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${category.badgeClass}`}>
                                            {category.photos.length} Foto
                                        </span>
                                    </div>

                                    {/* Daftar Foto Kategori - Ukuran Preview Besar dan Proporsional */}
                                    {category.photos.length > 0 ? (
                                        <div className="space-y-3.5 flex-1">
                                            {category.photos.map((p) => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => setActivePhoto(p)}
                                                    className="group relative border border-hairline rounded-lg overflow-hidden bg-canvas aspect-[4/3] cursor-pointer hover:border-primary transition-all duration-200 shadow-xs hover:shadow-md"
                                                    title="Klik untuk melihat foto dengan jelas"
                                                >
                                                    <img
                                                        src={p.path_foto}
                                                        alt={p.keterangan || category.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src =
                                                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>';
                                                        }}
                                                    />

                                                    {/* Badge Kategori di atas tiap foto */}
                                                    <div className="absolute top-2.5 left-2.5 z-10">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold backdrop-blur-md shadow-xs border ${category.badgeClass} bg-white/95`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${category.dotClass}`}></span>
                                                            {category.title}
                                                        </span>
                                                    </div>

                                                    {/* Hover Zoom Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="px-3 py-1.5 bg-black/80 text-white rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                                                            <ZoomIn className="w-3.5 h-3.5" /> Lihat Jelas
                                                        </span>
                                                    </div>

                                                    {/* Keterangan di bawah foto */}
                                                    {p.keterangan && (
                                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 py-2 pt-5">
                                                            <p className="text-xs text-white line-clamp-2 leading-relaxed">{p.keterangan}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 border border-dashed border-hairline rounded-lg text-center bg-canvas">
                                            <Camera className="w-6 h-6 text-mute/50 mb-2" />
                                            <span className="text-xs text-mute">Tidak ada foto {category.title.toLowerCase()}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal Lightbox Foto Full Resolution */}
                {activePhoto && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
                        onClick={() => setActivePhoto(null)}
                    >
                        <div
                            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Bar Atas */}
                            <div className="w-full flex items-center justify-between text-white mb-2 px-1">
                                <div className="flex items-center gap-2">
                                    <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded bg-white/20 uppercase tracking-wide">
                                        Foto {activePhoto.jenis_foto} Treatment
                                    </span>
                                    {activePhoto.keterangan && (
                                        <span className="text-sm font-medium text-white/90 truncate max-w-md hidden sm:inline">
                                            — {activePhoto.keterangan}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={activePhoto.path_foto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                                        title="Buka gambar di tab baru"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setActivePhoto(null)}
                                        className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                                        title="Tutup (ESC)"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Foto Full Size */}
                            <div className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center max-h-[80vh] w-full shadow-2xl border border-white/10">
                                <img
                                    src={activePhoto.path_foto}
                                    alt={activePhoto.keterangan || 'Foto Dokumentasi'}
                                    className="max-h-[80vh] max-w-full object-contain select-none"
                                />
                            </div>

                            {/* Keterangan di bawah foto */}
                            {activePhoto.keterangan && (
                                <p className="mt-3 text-white/95 text-sm text-center max-w-xl bg-black/60 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/10">
                                    {activePhoto.keterangan}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CustomerPortalLayout>
    );
}
