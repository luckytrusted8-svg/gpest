import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { StatusBadge } from '../WorkReports/Index';
import { FileText, Calendar, User, Eye, ClipboardList } from 'lucide-react';

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
    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Laporan Kerja - Customer Portal" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Laporan Hasil Pekerjaan (Work Reports)</h1>
                    <p className="text-body-sm text-mute mt-1">Dokumentasi hasil inspeksi dan tindakan treatment di lokasi Anda.</p>
                </div>

                {/* Reports Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
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
                                {workReports.data && workReports.data.length > 0 ? (
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
                                                <StatusBadge status={wr.status} />
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

                    {/* Pagination */}
                    {workReports.links && workReports.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {workReports.total} laporan</div>
                            <div className="flex items-center gap-1">
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
