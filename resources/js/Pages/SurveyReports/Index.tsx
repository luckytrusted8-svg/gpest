import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus, Search, Eye, Edit, Trash2, FileText, User, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Customer { id: number; company_name: string; }
interface Technician { id: number; name: string; }

interface SurveyReport {
    id: number;
    nomor_survey: string;
    customer?: Customer;
    technician?: Technician;
    tanggal_survey: string;
    tingkat_risiko: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
    status: 'draft' | 'dikirim' | 'disetujui' | 'selesai';
}

interface PaginationLink { url: string | null; label: string; active: boolean; }
interface Paginated { data: SurveyReport[]; total: number; links: PaginationLink[]; }

interface Props {
    surveyReports: Paginated;
    technicians: Technician[];
    filters: Record<string, string>;
}

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; cls: string }> = {
        draft:     { label: 'Draft',     cls: 'bg-canvas-soft-2 text-body-text border border-hairline' },
        dikirim:   { label: 'Dikirim',   cls: 'bg-[#f5a623]/15 text-[#ab570a]' },
        disetujui: { label: 'Disetujui', cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
        selesai:   { label: 'Selesai',   cls: 'bg-[#0070f3]/15 text-[#0070f3]' },
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
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
};

export default function Index({ surveyReports, technicians, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [tanggal, setTanggal] = useState(filters.tanggal || '');
    const [technicianId, setTechnicianId] = useState(filters.technician_id || '');
    const [risiko, setRisiko] = useState(filters.tingkat_risiko || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (overrides: object = {}) => {
        router.get('/survey-reports', { search, tanggal, technician_id: technicianId, tingkat_risiko: risiko, status, ...overrides }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch(''); setTanggal(''); setTechnicianId(''); setRisiko(''); setStatus('');
        router.get('/survey-reports', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number, nomor: string) => {
        if (confirm(`Hapus laporan survey "${nomor}"?`)) {
            router.delete(`/survey-reports/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Laporan Survey" />
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Laporan Survey</h1>
                        <p className="text-body-sm text-mute mt-1">Inspeksi dan survey area sebelum treatment dilakukan.</p>
                    </div>
                    <Link href="/survey-reports/create">
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Buat Survey Baru
                        </Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                            <Input placeholder="Cari nomor survey, customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                        </div>
                        <Input type="date" value={tanggal} onChange={(e) => { setTanggal(e.target.value); applyFilters({ tanggal: e.target.value }); }} className="w-full sm:w-40" />
                        <select value={technicianId} onChange={(e) => { setTechnicianId(e.target.value); applyFilters({ technician_id: e.target.value }); }} className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-40">
                            <option value="">Semua Teknisi</option>
                            {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <select value={risiko} onChange={(e) => { setRisiko(e.target.value); applyFilters({ tingkat_risiko: e.target.value }); }} className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-32">
                            <option value="">Semua Risiko</option>
                            <option value="rendah">Rendah</option>
                            <option value="sedang">Sedang</option>
                            <option value="tinggi">Tinggi</option>
                            <option value="kritis">Kritis</option>
                        </select>
                        <select value={status} onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }} className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-32">
                            <option value="">Semua Status</option>
                            <option value="draft">Draft</option>
                            <option value="dikirim">Dikirim</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="selesai">Selesai</option>
                        </select>
                        <Button type="submit" variant="outline" className="text-body-sm-strong">Filter</Button>
                        <Button type="button" variant="ghost" onClick={resetFilters} className="text-body-sm text-mute hover:text-ink">Reset</Button>
                    </form>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Nomor Survey</th>
                                    <th className="py-3 px-4 font-semibold">Customer</th>
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal</th>
                                    <th className="py-3 px-4 font-semibold">Risiko</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {surveyReports.data.length > 0 ? surveyReports.data.map((sr) => (
                                    <tr key={sr.id} className="hover:bg-canvas-soft/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <Link href={`/survey-reports/${sr.id}`} className="font-mono font-medium text-link hover:underline flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-mute shrink-0" />
                                                {sr.nomor_survey}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 font-medium">{sr.customer?.company_name ?? '-'}</td>
                                        <td className="py-3 px-4 text-body-text"><div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-mute" />{sr.technician?.name ?? '-'}</div></td>
                                        <td className="py-3 px-4 text-body-text"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-mute" />{sr.tanggal_survey}</div></td>
                                        <td className="py-3 px-4"><RisikoBadge risiko={sr.tingkat_risiko} /></td>
                                        <td className="py-3 px-4"><StatusBadge status={sr.status} /></td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/survey-reports/${sr.id}`}><Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink"><Eye className="w-4 h-4" /></Button></Link>
                                                {sr.status === 'draft' && <Link href={`/survey-reports/${sr.id}/edit`}><Button variant="outline" size="icon" className="h-8 w-8 text-body-text hover:text-ink"><Edit className="w-4 h-4" /></Button></Link>}
                                                <Button variant="outline" size="icon" className="h-8 w-8 text-error hover:bg-error/10" onClick={() => handleDelete(sr.id, sr.nomor_survey)}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="py-10 text-center text-mute text-body-sm">Belum ada laporan survey.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {surveyReports.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {surveyReports.total} laporan</div>
                            <div className="flex items-center gap-1">
                                {surveyReports.links.map((link, idx) => link.url ? (
                                    <Link key={idx} href={link.url} className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${link.active ? 'bg-primary text-on-primary border-primary' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
