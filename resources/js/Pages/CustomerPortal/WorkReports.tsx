import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { FileText, Calendar, User, Eye, ClipboardList } from 'lucide-react';

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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
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

interface WorkReport {
    id: number;
    nomor_laporan: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string | null;
    jenis_layanan: string;
    status: 'draft' | 'dikirim' | 'disetujui' | 'revisi' | 'selesai';
    technician?: { name: string };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReports {
    data: WorkReport[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    customerUser: CustomerUser;
    workReports: PaginatedReports;
}

export default function WorkReports({ customerUser, workReports }: Props) {
    const hasReports = workReports.data && workReports.data.length > 0;

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Laporan Kerja - Customer Portal" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Laporan Hasil Pekerjaan (Work Reports)</h1>
                    <p className="text-body-sm text-mute mt-1">Dokumentasi hasil inspeksi dan tindakan treatment di lokasi Anda.</p>
                </div>

                {/* Reports Container */}
                <div className="bg-canvas border border-hairline rounded-xl shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Nomor Laporan</th>
                                    <th className="py-3 px-4 font-semibold">Jenis Layanan</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {hasReports ? (
                                    workReports.data.map((wr) => (
                                        <tr key={wr.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <Link href={`/portal/work-reports/${wr.id}`} className="font-mono font-semibold text-link hover:underline flex items-center gap-2">
                                                    <ClipboardList className="w-4 h-4 text-mute shrink-0" />
                                                    {wr.nomor_laporan}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-ink">
                                                {wr.jenis_layanan}
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span>{wr.tanggal}</span>
                                                </div>
                                                <div className="text-xs text-mute mt-0.5">{wr.jam_mulai}{wr.jam_selesai ? ` - ${wr.jam_selesai}` : ''}</div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                {wr.technician ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-mute shrink-0" />
                                                        <span>{wr.technician.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-mute italic">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <WorkReportStatusBadge status={wr.status} />
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <Link href={`/portal/work-reports/${wr.id}`}>
                                                    <Button variant="outline" size="sm" className="text-body-sm flex items-center gap-1.5 ml-auto">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada laporan kerja yang tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout View */}
                    <div className="block sm:hidden">
                        {hasReports ? (
                            <div className="divide-y divide-hairline">
                                {workReports.data.map((wr) => (
                                    <div key={wr.id} className="p-4 space-y-3.5 hover:bg-canvas-soft/30 transition-colors">
                                        {/* Card Header: Nomor Laporan di kiri atas, Status di kanan atas */}
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={`/portal/work-reports/${wr.id}`}
                                                className="font-mono font-bold text-sm text-ink hover:text-primary flex items-center gap-2"
                                            >
                                                <ClipboardList className="w-4 h-4 text-slate-500 shrink-0" />
                                                <span>{wr.nomor_laporan}</span>
                                            </Link>
                                            <WorkReportStatusBadge status={wr.status} />
                                        </div>

                                        {/* Card Body: Jenis Layanan & Tanggal Kunjungan di tengah */}
                                        <div className="bg-canvas-soft/70 border border-hairline rounded-lg p-3 space-y-2">
                                            <div>
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-mute block">
                                                    Jenis Layanan
                                                </span>
                                                <span className="text-sm font-semibold text-ink">
                                                    {wr.jenis_layanan}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-hairline/60 text-xs text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span>{wr.tanggal}</span>
                                                    <span className="text-mute font-mono text-[11px]">
                                                        ({wr.jam_mulai}{wr.jam_selesai ? ` - ${wr.jam_selesai}` : ''})
                                                    </span>
                                                </div>
                                            </div>

                                            {wr.technician && (
                                                <div className="flex items-center gap-1.5 text-xs text-mute pt-1">
                                                    <User className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span>Teknisi: <strong className="text-body-text font-medium">{wr.technician.name}</strong></span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Footer: Full-Width Button "Lihat Detail" */}
                                        <div>
                                            <Link href={`/portal/work-reports/${wr.id}`} className="block w-full">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full justify-center text-body-sm font-medium h-9 gap-1.5 shadow-xs"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 px-4 text-center text-mute text-body-sm">
                                Belum ada laporan kerja yang tersedia.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {workReports.links && workReports.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm bg-canvas-soft/40">
                            <div className="text-mute text-xs sm:text-sm">Total {workReports.total} laporan</div>
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                                {workReports.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-on-primary border-primary'
                                                    : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={idx} className="px-3 py-1 rounded border text-xs font-medium bg-canvas-soft text-mute border-hairline opacity-50" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerPortalLayout>
    );
}
