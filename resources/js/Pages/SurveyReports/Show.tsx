import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle, FileText, User, Calendar, MapPin, AlertTriangle, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Photo { id: number; path_foto: string; keterangan: string | null; }
interface Customer { id: number; company_name: string; }
interface Technician { id: number; name: string; }
interface Contract { id: number; contract_number: string; }

interface SurveyReport {
    id: number;
    nomor_survey: string;
    customer?: Customer;
    contract?: Contract;
    technician?: Technician;
    tanggal_survey: string;
    lokasi: string;
    jenis_hama: string[];
    area_survey: string;
    temuan: string;
    tingkat_risiko: string;
    rekomendasi: string;
    catatan: string | null;
    status: string;
    photos: Photo[];
    created_at: string;
}

interface PreviousSurvey { id: number; nomor_survey: string; tanggal_survey: string; tingkat_risiko: string; status: string; }

interface Props {
    surveyReport: SurveyReport;
    previousSurveys: PreviousSurvey[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft: { label: 'Draft', cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        dikirim: { label: 'Dikirim', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        disetujui: { label: 'Disetujui', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        selesai: { label: 'Selesai', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
    };
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

const RisikoBadge = ({ risiko }: { risiko: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        rendah: { label: 'Rendah', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        sedang: { label: 'Sedang', cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        tinggi: { label: 'Tinggi', cls: 'bg-[#f97316]/15 text-[#c2410c]' },
        kritis: { label: 'Kritis', cls: 'bg-[#ee0000]/15 text-[#ee0000]' },
    };
    const { label, cls } = map[risiko] ?? { label: risiko, cls: 'bg-canvas-soft-2 text-body-text border border-hairline' };
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>{label}</span>;
};

export default function Show({ surveyReport, previousSurveys }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;
    const [approving, setApproving] = useState(false);

    const handleApprove = () => {
        if (!confirm('Setujui laporan survey ini?')) return;
        setApproving(true);
        router.post(`/survey-reports/${surveyReport.id}/approve`, {}, { onFinish: () => setApproving(false) });
    };

    const handleDelete = () => {
        if (!confirm('Hapus laporan survey ini?')) return;
        router.delete(`/survey-reports/${surveyReport.id}`);
    };

    const isSuperAdmin = ((usePage().props as Record<string, unknown>).auth as Record<string, unknown>)?.user as Record<string, unknown> | undefined;
    const roles = (isSuperAdmin?.roles as string[]) ?? [];

    return (
        <AppLayout>
            <Head title={`Survey ${surveyReport.nomor_survey}`} />
            <div className="max-w-5xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/survey-reports"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button></Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">{surveyReport.nomor_survey}</h1>
                            <p className="text-body-sm text-mute mt-0.5">Detail laporan survey inspeksi.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {surveyReport.status === 'draft' && <Link href={`/survey-reports/${surveyReport.id}/edit`}><Button variant="outline" className="text-body-sm-strong flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Button></Link>}
                        {(roles.includes('super_admin') || roles.includes('supervisor')) && surveyReport.status === 'dikirim' && (
                            <Button onClick={handleApprove} disabled={approving} className="bg-[#0070f3] hover:bg-[#0060df] text-white text-body-sm-strong flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {approving ? 'Menyetujui...' : 'Setujui'}</Button>
                        )}
                        <a href={route('survey-reports.pdf', surveyReport.id)} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2"><Download className="w-4 h-4" /> Download PDF</Button>
                        </a>
                        <Button variant="outline" size="icon" className="h-9 w-9 text-error hover:bg-error/10" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-hairline pb-3">
                                <h2 className="text-body-md-strong text-ink">Informasi Survey</h2>
                                <div className="flex items-center gap-2"><StatusBadge status={surveyReport.status} /><RisikoBadge risiko={surveyReport.tingkat_risiko} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-body-sm">
                                <div><span className="text-mute">Customer</span><div className="font-medium text-ink">{surveyReport.customer?.company_name ?? '-'}</div></div>
                                <div><span className="text-mute">Kontrak</span><div className="font-medium text-ink">{surveyReport.contract?.contract_number ?? '-'}</div></div>
                                <div><span className="text-mute">Teknisi</span><div className="font-medium text-ink flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-mute" />{surveyReport.technician?.name ?? '-'}</div></div>
                                <div><span className="text-mute">Tanggal</span><div className="font-medium text-ink flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-mute" />{surveyReport.tanggal_survey}</div></div>
                                <div className="col-span-2"><span className="text-mute">Lokasi</span><div className="font-medium text-ink flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-mute" />{surveyReport.lokasi}</div></div>
                                <div><span className="text-mute">Area Survey</span><div className="font-medium text-ink">{surveyReport.area_survey}</div></div>
                            </div>
                        </div>

                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-3">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Jenis Hama</h2>
                            <div className="flex flex-wrap gap-2">{surveyReport.jenis_hama.map((hama) => <span key={hama} className="px-3 py-1 bg-canvas-soft-2 rounded-full text-xs font-medium text-body-text border border-hairline">{hama}</span>)}</div>
                        </div>

                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-3">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Temuan</h2>
                            <p className="text-body-sm text-body-text whitespace-pre-wrap">{surveyReport.temuan}</p>
                        </div>

                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-3">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Rekomendasi</h2>
                            <p className="text-body-sm text-body-text whitespace-pre-wrap">{surveyReport.rekomendasi}</p>
                        </div>

                        {surveyReport.catatan && (
                            <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-3">
                                <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Catatan</h2>
                                <p className="text-body-sm text-body-text whitespace-pre-wrap">{surveyReport.catatan}</p>
                            </div>
                        )}

                        {surveyReport.photos.length > 0 && (
                            <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-3">
                                <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Dokumentasi Foto</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {surveyReport.photos.map((photo) => (
                                        <div key={photo.id} className="space-y-1">
                                            <img src={photo.path_foto} alt={photo.keterangan ?? 'Foto'} className="w-full h-32 object-cover rounded-md border border-hairline" />
                                            {photo.keterangan && <p className="text-[11px] text-mute text-center">{photo.keterangan}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4 text-mute" /><h3 className="text-body-sm-strong text-ink">Tingkat Risiko</h3></div>
                            <div className={`p-4 rounded-lg text-center ${
                                surveyReport.tingkat_risiko === 'kritis' ? 'bg-[#ee0000]/10 text-[#ee0000]' :
                                surveyReport.tingkat_risiko === 'tinggi' ? 'bg-[#f97316]/10 text-[#c2410c]' :
                                surveyReport.tingkat_risiko === 'sedang' ? 'bg-[#f5a623]/10 text-[#ab570a]' :
                                'bg-[#0070f3]/10 text-[#0070f3]'
                            }`}>
                                <div className="text-display-sm font-bold capitalize">{surveyReport.tingkat_risiko}</div>
                            </div>
                        </div>

                        {previousSurveys.length > 0 && (
                            <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                                <div className="p-4 border-b border-hairline"><h3 className="text-body-sm-strong text-ink">Riwayat Survey Customer</h3></div>
                                <div className="divide-y divide-hairline">
                                    {previousSurveys.map((ps) => (
                                        <Link key={ps.id} href={`/survey-reports/${ps.id}`} className="block px-4 py-3 hover:bg-canvas-soft/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs font-mono text-link">{ps.nomor_survey}</div>
                                                    <div className="text-[11px] text-mute mt-0.5">{ps.tanggal_survey}</div>
                                                </div>
                                                <StatusBadge status={ps.status} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
