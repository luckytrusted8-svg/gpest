import { Head, Link } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { StatusBadge as ScheduleStatusBadge, PriorityBadge } from '../Schedules/Index';
import { Calendar, Clock, MapPin, User, Tag } from 'lucide-react';

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

interface Schedule {
    id: number;
    schedule_code: string;
    lokasi: string;
    jenis_layanan: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
    catatan: string | null;
    technician?: { name: string };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSchedules {
    data: Schedule[];
    total: number;
    links: PaginationLink[];
}

interface Props {
    customerUser: CustomerUser;
    schedules: PaginatedSchedules;
}

export default function Schedules({ customerUser, schedules }: Props) {
    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Jadwal Layanan - Customer Portal" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Jadwal Kunjungan & Layanan</h1>
                    <p className="text-body-sm text-mute mt-1">Pantau agenda kunjungan teknisi ke lokasi properti Anda.</p>
                </div>

                {/* Schedules Table */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">Kode Jadwal</th>
                                    <th className="py-3 px-4 font-semibold">Jenis Layanan</th>
                                    <th className="py-3 px-4 font-semibold">Lokasi Kunjungan</th>
                                    <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                                    <th className="py-3 px-4 font-semibold">Teknisi</th>
                                    <th className="py-3 px-4 font-semibold">Prioritas</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {schedules.data && schedules.data.length > 0 ? (
                                    schedules.data.map((sch) => (
                                        <tr key={sch.id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-4 px-4 font-mono font-semibold text-ink">
                                                {sch.schedule_code}
                                            </td>
                                            <td className="py-4 px-4 font-medium text-ink">
                                                {sch.jenis_layanan}
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5 max-w-[220px] truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span className="truncate">{sch.lokasi}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-mute shrink-0" />
                                                    <span>{sch.tanggal}</span>
                                                </div>
                                                <div className="text-xs text-mute flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{sch.jam_mulai} - {sch.jam_selesai}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-body-text">
                                                {sch.technician ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-mute shrink-0" />
                                                        <span>{sch.technician.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-mute italic">Belum ditugaskan</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <PriorityBadge prioritas={sch.prioritas} />
                                            </td>
                                            <td className="py-4 px-4">
                                                <ScheduleStatusBadge status={sch.status} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada data jadwal kunjungan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {schedules.links && schedules.links.length > 3 && (
                        <div className="p-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm">
                            <div className="text-mute">Total {schedules.total} jadwal</div>
                            <div className="flex items-center gap-1">
                                {schedules.links.map((link, idx) => (
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
