import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { StatusBadge } from './Index';
import {
    ArrowLeft,
    Edit,
    CheckCircle,
    RotateCcw,
    FileText,
    Camera,
    ClipboardList,
    AlertTriangle,
    Download,
    ZoomIn,
    X,
    ExternalLink,
    Clock,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Contract {
    id: number;
    contract_number: string;
    contract_type: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
}

interface Technician {
    id: number;
    name: string;
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
    customer_id: number;
    customer?: Customer;
    contract?: Contract;
    schedule?: Schedule;
    technician_id: number;
    technician?: Technician;
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
    photos: Photo[];
    created_at: string;
    updated_at: string;
}

interface Props {
    workReport: WorkReport;
}

function PhotoGrid({
    photos,
    label,
    onPhotoClick,
}: {
    photos: Photo[];
    label: string;
    onPhotoClick: (photo: Photo) => void;
}) {
    if (photos.length === 0) return null;
    return (
        <div className="space-y-2">
            <h4 className="text-caption-mono uppercase text-mute font-semibold tracking-wide flex items-center justify-between">
                <span>{label}</span>
                <span className="text-xs font-normal lowercase">({photos.length} foto - klik untuk perbesar)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => onPhotoClick(p)}
                        className="group relative border border-hairline rounded-md overflow-hidden bg-canvas-soft aspect-square cursor-pointer hover:border-primary transition-all duration-200 shadow-xs hover:shadow-md"
                        title="Klik untuk melihat foto dengan jelas"
                    >
                        <img
                            src={p.path_foto}
                            alt={p.keterangan || label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2.5 py-1 bg-black/75 text-white rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                                <ZoomIn className="w-3.5 h-3.5" /> Lihat Jelas
                            </span>
                        </div>
                        {p.keterangan && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                                <p className="text-xs text-white truncate">{p.keterangan}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Show({ workReport }: Props) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth?.user?.roles?.includes('admin') ?? false;
    const isTechnician = auth?.user?.id === workReport.technician_id;

    const [showApprove, setShowApprove] = useState(false);
    const [showRevision, setShowRevision] = useState(false);
    const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

    const approveForm = useForm({ catatan_supervisor: '' });
    const revisionForm = useForm({ catatan_supervisor: '' });

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActivePhoto(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const submitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        approveForm.post(route('work-reports.approve', workReport.id), {
            onSuccess: () => setShowApprove(false),
        });
    };

    const submitRevision = (e: React.FormEvent) => {
        e.preventDefault();
        revisionForm.post(route('work-reports.revision', workReport.id), {
            onSuccess: () => setShowRevision(false),
        });
    };

    const photosBefore = workReport.photos.filter((p) => p.jenis_foto === 'sebelum');
    const photosDuring = workReport.photos.filter((p) => p.jenis_foto === 'selama');
    const photosAfter = workReport.photos.filter((p) => p.jenis_foto === 'sesudah');

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <div className="text-caption-mono uppercase text-mute mb-1">{label}</div>
            <div className="text-body-sm text-body-text">{value || <span className="text-mute italic">–</span>}</div>
        </div>
    );

    return (
        <AppLayout>
            <Head title={`Laporan: ${workReport.nomor_laporan}`} />

            <div className="max-w-5xl mx-auto space-y-6 pb-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('work-reports.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-display-sm font-semibold text-ink font-mono">{workReport.nomor_laporan}</h1>
                                <StatusBadge status={workReport.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">
                                {workReport.customer?.company_name} — {workReport.tanggal}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <a href={route('work-reports.pdf', workReport.id)} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Download className="w-4 h-4" /> Download PDF
                            </Button>
                        </a>

                        {/* Edit Button: HANYA untuk teknisi pembuat laporan saat draft atau revisi. Admin TIDAK BISA edit */}
                        {!isAdmin && isTechnician && (workReport.status === 'draft' || workReport.status === 'revisi') && (
                            <Link href={route('work-reports.edit', workReport.id)}>
                                <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                    <Edit className="w-4 h-4" /> {workReport.status === 'revisi' ? 'Perbaiki Laporan' : 'Edit Laporan'}
                                </Button>
                            </Link>
                        )}

                        {/* Approval & Revision: HANYA UNTUK ADMIN */}
                        {isAdmin && workReport.status === 'dikirim' && (
                            <>
                                <Button
                                    className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-2"
                                    onClick={() => setShowApprove(true)}
                                >
                                    <CheckCircle className="w-4 h-4" /> Setujui
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#f5a623] text-[#ab570a] hover:bg-[#f5a623]/10 text-body-sm-strong flex items-center gap-2"
                                    onClick={() => setShowRevision(true)}
                                >
                                    <RotateCcw className="w-4 h-4" /> Minta Revisi
                                </Button>
                            </>
                        )}

                        {/* Status Info untuk Non-Admin (Teknisi) saat status 'dikirim' */}
                        {!isAdmin && workReport.status === 'dikirim' && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-md text-body-sm font-medium">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span>Menunggu Persetujuan Admin</span>
                            </div>
                        )}

                        {/* Status Info saat sudah disetujui */}
                        {workReport.status === 'disetujui' && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-md text-body-sm font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Disetujui Admin (Terlihat di Customer)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Banner Status Revisi */}
                {workReport.status === 'revisi' && (
                    <div className="rounded-md border p-4 bg-amber-500/10 border-amber-500/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="text-body-sm-strong text-ink font-semibold mb-1">
                                Laporan Memerlukan Revisi
                            </div>
                            <p className="text-body-sm text-body-text mb-2">
                                {isAdmin
                                    ? `Anda telah meminta revisi pada laporan ini. Menunggu teknisi (${workReport.technician?.name || 'Teknisi'}) melakukan perbaikan dan mengirim ulang.`
                                    : 'Admin telah meninjau laporan ini dan meminta revisi perbaikan. Silakan periksa catatan berikut:'}
                            </p>
                            {workReport.catatan_supervisor ? (
                                <div className="p-3 bg-white/70 border border-amber-200 rounded text-body-sm text-ink italic mb-3">
                                    "{workReport.catatan_supervisor}"
                                </div>
                            ) : null}
                            {!isAdmin && isTechnician && (
                                <Link href={route('work-reports.edit', workReport.id)}>
                                    <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700 flex items-center gap-1.5 text-xs font-semibold">
                                        <Edit className="w-3.5 h-3.5" /> Perbaiki & Kirim Ulang ke Admin
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Catatan Supervisor saat Disetujui */}
                {workReport.status === 'disetujui' && workReport.catatan_supervisor && (
                    <div className="rounded-md border p-4 bg-emerald-500/10 border-emerald-500/30 flex items-start gap-3">
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                            <div className="text-body-sm-strong text-ink mb-1">Catatan Persetujuan Admin</div>
                            <p className="text-body-sm text-body-text">{workReport.catatan_supervisor}</p>
                        </div>
                    </div>
                )}

                {/* Informasi Pekerjaan */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mute" /> Informasi Pekerjaan
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Nomor Laporan" value={<span className="font-mono font-medium text-ink">{workReport.nomor_laporan}</span>} />
                        <InfoRow label="Customer" value={<span className="font-medium text-ink">{workReport.customer?.company_name}</span>} />
                        <InfoRow label="Tanggal" value={workReport.tanggal} />
                        <InfoRow label="Waktu" value={`${workReport.jam_mulai}${workReport.jam_selesai ? ' – ' + workReport.jam_selesai : ''}`} />
                        <InfoRow label="Teknisi" value={workReport.technician?.name} />
                        <InfoRow label="Kontrak" value={workReport.contract?.contract_number} />
                        <InfoRow label="Jadwal Terkait" value={workReport.schedule?.schedule_code} />
                    </div>
                </div>

                {/* Hasil Inspeksi */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-mute" /> Hasil Inspeksi
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Aktivitas Hama" value={workReport.aktivitas_hama} />
                        <InfoRow label="Tingkat Keparahan" value={workReport.tingkat_keparahan} />
                    </div>
                    {workReport.temuan && <InfoRow label="Temuan" value={<p className="text-body-text whitespace-pre-line">{workReport.temuan}</p>} />}
                    {workReport.rekomendasi && <InfoRow label="Rekomendasi Tindak Lanjut" value={<p className="text-body-text whitespace-pre-line">{workReport.rekomendasi}</p>} />}
                </div>

                {/* Detail Treatment */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-mute" /> Detail Treatment
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Jenis Layanan" value={workReport.jenis_layanan} />
                        <InfoRow label="Jenis Hama" value={workReport.jenis_hama} />
                        <InfoRow label="Metode Treatment" value={workReport.metode_treatment} />
                        <InfoRow label="Bahan Kimia" value={workReport.bahan_kimia} />
                        <InfoRow label="Jumlah Bahan" value={workReport.jumlah_bahan} />
                        <InfoRow label="Peralatan" value={workReport.peralatan} />
                    </div>
                    {workReport.area_treatment && <InfoRow label="Area Treatment" value={<p className="text-body-text whitespace-pre-line">{workReport.area_treatment}</p>} />}
                </div>

                {/* Dokumentasi Foto */}
                {workReport.photos.length > 0 && (
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-6">
                        <div className="border-b border-hairline pb-3 flex items-center justify-between">
                            <h2 className="text-body-sm-strong text-ink uppercase tracking-wide flex items-center gap-2">
                                <Camera className="w-4 h-4 text-mute" /> Dokumentasi Foto ({workReport.photos.length})
                            </h2>
                            <span className="text-xs text-mute font-medium">Klik foto untuk melihat dalam resolusi penuh</span>
                        </div>
                        <div className="space-y-6">
                            <PhotoGrid photos={photosBefore} label="Sebelum Treatment" onPhotoClick={setActivePhoto} />
                            <PhotoGrid photos={photosDuring} label="Selama Treatment" onPhotoClick={setActivePhoto} />
                            <PhotoGrid photos={photosAfter} label="Sesudah Treatment" onPhotoClick={setActivePhoto} />
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

                {/* Modal Setujui (Hanya Admin) */}
                {showApprove && isAdmin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-body-md-strong text-ink">Setujui Laporan Kerja</h3>
                            </div>
                            <p className="text-body-sm text-mute">
                                Anda sebagai <span className="font-semibold text-ink">Admin</span> akan menyetujui laporan{' '}
                                <span className="font-mono font-medium text-ink">{workReport.nomor_laporan}</span>. Setelah disetujui, laporan ini akan otomatis tampil di portal pelanggan ({workReport.customer?.company_name}).
                            </p>
                            <form onSubmit={submitApprove} className="space-y-3">
                                <Textarea
                                    value={approveForm.data.catatan_supervisor}
                                    onChange={(e) => approveForm.setData('catatan_supervisor', e.target.value)}
                                    placeholder="Catatan persetujuan (opsional)..."
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowApprove(false)}>
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                                        disabled={approveForm.processing}
                                    >
                                        Setujui & Publikasikan
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Revisi (Hanya Admin) */}
                {showRevision && isAdmin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <RotateCcw className="w-5 h-5 text-amber-600" />
                                <h3 className="text-body-md-strong text-ink">Minta Revisi Laporan</h3>
                            </div>
                            <p className="text-body-sm text-mute">
                                Berikan instruksi revisi yang jelas agar teknisi ({workReport.technician?.name}) dapat memperbaiki laporan ini sebelum disetujui.
                            </p>
                            <form onSubmit={submitRevision} className="space-y-3">
                                <Textarea
                                    value={revisionForm.data.catatan_supervisor}
                                    onChange={(e) => revisionForm.setData('catatan_supervisor', e.target.value)}
                                    placeholder="Catatan hal yang perlu direvisi... (wajib diisi)"
                                    rows={4}
                                />
                                {revisionForm.errors.catatan_supervisor && (
                                    <div className="text-error text-xs">{revisionForm.errors.catatan_supervisor}</div>
                                )}
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRevision(false)}>
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-amber-600 text-white hover:bg-amber-700 font-semibold"
                                        disabled={revisionForm.processing}
                                    >
                                        Kirim Revisi ke Teknisi
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
