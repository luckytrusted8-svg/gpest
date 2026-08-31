import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { StatusBadge } from './Index';
import { ArrowLeft, Edit, Trash2, CheckCircle, RotateCcw, FileText, User, MapPin, Calendar, Clock, Wrench, Camera, ClipboardList, AlertTriangle, Download } from 'lucide-react';
import { useState } from 'react';

interface Customer { id: number; customer_id: string; company_name: string; }
interface Contract { id: number; contract_number: string; contract_type: string; }
interface Schedule { id: number; schedule_code: string; }
interface Technician { id: number; name: string; }
interface Photo { id: number; jenis_foto: 'sebelum' | 'selama' | 'sesudah'; path_foto: string; keterangan: string | null; }

interface WorkReport {
    id: number;
    nomor_laporan: string;
    customer?: Customer;
    contract?: Contract;
    schedule?: Schedule;
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

interface Props { workReport: WorkReport; }

function PhotoGrid({ photos, label }: { photos: Photo[]; label: string }) {
    if (photos.length === 0) return null;
    return (
        <div className="space-y-2">
            <h4 className="text-caption-mono uppercase text-mute font-semibold tracking-wide">{label}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map(p => (
                    <div key={p.id} className="border border-hairline rounded-md overflow-hidden bg-canvas-soft">
                        <img src={p.path_foto} alt={p.keterangan || label} className="w-full aspect-square object-cover" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>'; }} />
                        {p.keterangan && <p className="text-xs text-mute px-2 py-1 truncate">{p.keterangan}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Show({ workReport }: Props) {
    const [showApprove, setShowApprove] = useState(false);
    const [showRevision, setShowRevision] = useState(false);

    const approveForm = useForm({ catatan_supervisor: '' });
    const revisionForm = useForm({ catatan_supervisor: '' });

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

    const photosBefore = workReport.photos.filter(p => p.jenis_foto === 'sebelum');
    const photosDuring = workReport.photos.filter(p => p.jenis_foto === 'selama');
    const photosAfter  = workReport.photos.filter(p => p.jenis_foto === 'sesudah');

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
                            <p className="text-body-sm text-mute mt-0.5">{workReport.customer?.company_name} — {workReport.tanggal}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <a href={route('work-reports.pdf', workReport.id)} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Download className="w-4 h-4" /> Download PDF
                            </Button>
                        </a>
                        {(workReport.status === 'draft' || workReport.status === 'revisi') && (
                            <Link href={route('work-reports.edit', workReport.id)}>
                                <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                    <Edit className="w-4 h-4" /> Edit
                                </Button>
                            </Link>
                        )}
                        {workReport.status === 'dikirim' && (
                            <>
                                <Button
                                    className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2"
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
                    </div>
                </div>

                {/* Catatan Supervisor (jika ada) */}
                {workReport.catatan_supervisor && (
                    <div className={`rounded-md border p-4 flex items-start gap-3 ${workReport.status === 'revisi' ? 'bg-[#f5a623]/10 border-[#f5a623]/40' : 'bg-[#0070f3]/10 border-[#0070f3]/30'}`}>
                        <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${workReport.status === 'revisi' ? 'text-[#ab570a]' : 'text-[#0070f3]'}`} />
                        <div>
                            <div className="text-body-sm-strong text-ink mb-1">Catatan Supervisor</div>
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
                        <InfoRow label="Waktu" value={`${workReport.jam_mulai}${workReport.jam_selesai ? ' – '+workReport.jam_selesai : ''}`} />
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
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-mute" /> Dokumentasi Foto ({workReport.photos.length})
                        </h2>
                        <div className="space-y-5">
                            <PhotoGrid photos={photosBefore} label="Sebelum Treatment" />
                            <PhotoGrid photos={photosDuring} label="Selama Treatment" />
                            <PhotoGrid photos={photosAfter}  label="Sesudah Treatment" />
                        </div>
                    </div>
                )}

                {/* Modal Setujui */}
                {showApprove && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-[#0070f3]" />
                                <h3 className="text-body-md-strong text-ink">Setujui Laporan Kerja</h3>
                            </div>
                            <p className="text-body-sm text-mute">Anda akan menyetujui laporan <span className="font-mono font-medium text-ink">{workReport.nomor_laporan}</span>. Tambahkan catatan jika diperlukan.</p>
                            <form onSubmit={submitApprove} className="space-y-3">
                                <Textarea
                                    value={approveForm.data.catatan_supervisor}
                                    onChange={e => approveForm.setData('catatan_supervisor', e.target.value)}
                                    placeholder="Catatan persetujuan (opsional)..."
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowApprove(false)}>Batal</Button>
                                    <Button type="submit" className="flex-1 bg-primary text-on-primary hover:bg-ink" disabled={approveForm.processing}>Setujui Laporan</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Revisi */}
                {showRevision && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <RotateCcw className="w-5 h-5 text-[#ab570a]" />
                                <h3 className="text-body-md-strong text-ink">Minta Revisi</h3>
                            </div>
                            <p className="text-body-sm text-mute">Berikan catatan revisi yang jelas agar teknisi dapat memperbaiki laporan ini.</p>
                            <form onSubmit={submitRevision} className="space-y-3">
                                <Textarea
                                    value={revisionForm.data.catatan_supervisor}
                                    onChange={e => revisionForm.setData('catatan_supervisor', e.target.value)}
                                    placeholder="Catatan revisi yang diperlukan... (wajib diisi)"
                                    rows={4}
                                />
                                {revisionForm.errors.catatan_supervisor && <div className="text-error text-xs">{revisionForm.errors.catatan_supervisor}</div>}
                                <div className="flex gap-3">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowRevision(false)}>Batal</Button>
                                    <Button type="submit" className="flex-1 bg-[#f5a623] text-white hover:bg-[#ab570a]" disabled={revisionForm.processing}>Kirim Revisi</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
