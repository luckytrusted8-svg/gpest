import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { StatusBadge } from '../WorkReports/Index';
import { ArrowLeft, FileText, User, Calendar, Clock, Wrench, Camera, ClipboardList, CheckCircle2 } from 'lucide-react';

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

function PhotoGrid({ photos, label }: { photos: Photo[]; label: string }) {
    if (photos.length === 0) return null;
    return (
        <div className="space-y-2">
            <h4 className="text-caption-mono uppercase text-mute font-semibold tracking-wide">{label}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((p) => (
                    <div key={p.id} className="border border-hairline rounded-md overflow-hidden bg-canvas-soft">
                        <img
                            src={p.path_foto}
                            alt={p.keterangan || label}
                            className="w-full aspect-square object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>';
                            }}
                        />
                        {p.keterangan && <p className="text-xs text-mute px-2 py-1 truncate">{p.keterangan}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function WorkReportShow({ customerUser, workReport }: Props) {
    const photosBefore = workReport.photos.filter((p) => p.jenis_foto === 'sebelum');
    const photosDuring = workReport.photos.filter((p) => p.jenis_foto === 'selama');
    const photosAfter  = workReport.photos.filter((p) => p.jenis_foto === 'sesudah');

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <div className="text-caption-mono uppercase text-mute mb-1">{label}</div>
            <div className="text-body-sm text-body-text">{value || <span className="text-mute italic">–</span>}</div>
        </div>
    );

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title={`Detail Laporan: ${workReport.nomor_laporan}`} />

            <div className="space-y-6 pb-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/portal/work-reports">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-display-sm font-semibold text-ink font-mono">{workReport.nomor_laporan}</h1>
                                <StatusBadge status={workReport.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">{workReport.jenis_layanan} — {workReport.tanggal}</p>
                        </div>
                    </div>
                    <Link href="/portal/work-reports">
                        <Button variant="outline" className="text-body-sm-strong">
                            Kembali ke Daftar Laporan
                        </Button>
                    </Link>
                </div>

                {/* Informasi Pekerjaan */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mute" /> Informasi Pekerjaan
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Nomor Laporan" value={<span className="font-mono font-medium text-ink">{workReport.nomor_laporan}</span>} />
                        <InfoRow label="Tanggal Kunjungan" value={workReport.tanggal} />
                        <InfoRow label="Waktu Pekerjaan" value={`${workReport.jam_mulai}${workReport.jam_selesai ? ' – ' + workReport.jam_selesai : ''}`} />
                        <InfoRow label="Teknisi Penanggung Jawab" value={workReport.technician?.name} />
                        <InfoRow label="Nomor Kontrak" value={workReport.contract?.contract_number} />
                        <InfoRow label="Kode Jadwal" value={workReport.schedule?.schedule_code} />
                    </div>
                </div>

                {/* Hasil Inspeksi */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-mute" /> Hasil Inspeksi Lapangan
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Aktivitas Hama" value={workReport.aktivitas_hama} />
                        <InfoRow label="Tingkat Keparahan" value={workReport.tingkat_keparahan} />
                    </div>
                    {workReport.temuan && <InfoRow label="Temuan Inspeksi" value={<p className="text-body-text whitespace-pre-line">{workReport.temuan}</p>} />}
                    {workReport.rekomendasi && <InfoRow label="Rekomendasi Teknisi" value={<p className="text-body-text whitespace-pre-line">{workReport.rekomendasi}</p>} />}
                </div>

                {/* Detail Treatment */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-mute" /> Detail Treatment Pest Control
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <InfoRow label="Jenis Layanan" value={workReport.jenis_layanan} />
                        <InfoRow label="Target Hama" value={workReport.jenis_hama} />
                        <InfoRow label="Metode Treatment" value={workReport.metode_treatment} />
                        <InfoRow label="Bahan Kimia" value={workReport.bahan_kimia} />
                        <InfoRow label="Jumlah Bahan" value={workReport.jumlah_bahan} />
                        <InfoRow label="Peralatan" value={workReport.peralatan} />
                    </div>
                    {workReport.area_treatment && <InfoRow label="Area Treatment" value={<p className="text-body-text whitespace-pre-line">{workReport.area_treatment}</p>} />}
                </div>

                {/* Dokumentasi Foto */}
                {workReport.photos && workReport.photos.length > 0 && (
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-mute" /> Foto Dokumentasi Pekerjaan ({workReport.photos.length})
                        </h2>
                        <div className="space-y-5">
                            <PhotoGrid photos={photosBefore} label="Sebelum Treatment" />
                            <PhotoGrid photos={photosDuring} label="Selama Treatment" />
                            <PhotoGrid photos={photosAfter}  label="Sesudah Treatment" />
                        </div>
                    </div>
                )}
            </div>
        </CustomerPortalLayout>
    );
}
