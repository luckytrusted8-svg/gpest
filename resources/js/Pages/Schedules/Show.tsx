import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { PriorityBadge, StatusBadge } from './Index';
import { Calendar, Clock, User, MapPin, ArrowLeft, Edit, FileText, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    pic_name?: string;
    phone?: string;
    email?: string;
}

interface Contract {
    id: number;
    contract_number: string;
    service_type: string;
}

interface UserStaff {
    id: number;
    name: string;
    email: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
    customer_id: number;
    customer?: Customer;
    contract_id: number | null;
    contract?: Contract;
    lokasi: string;
    jenis_layanan: string;
    technician_id: number | null;
    technician?: UserStaff;
    supervisor_id: number | null;
    supervisor?: UserStaff;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
    catatan: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    schedule: Schedule;
}

export default function Show({ schedule }: Props) {
    return (
        <AppLayout>
            <Head title={`Jadwal: ${schedule.schedule_code}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('schedules.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-display-sm font-semibold text-ink font-mono">{schedule.schedule_code}</h1>
                                <StatusBadge status={schedule.status} />
                                <PriorityBadge prioritas={schedule.prioritas} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5">
                                Customer: <span className="font-medium text-ink">{schedule.customer?.company_name || '-'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href={route('schedules.edit', schedule.id)}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Jadwal
                            </Button>
                        </Link>
                        <Link href={route('schedules.index')}>
                            <Button variant="outline" className="text-body-sm-strong">
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Tanggal & Waktu</div>
                        <div className="text-body-md-strong text-ink flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-mute shrink-0" />
                            {schedule.tanggal}
                        </div>
                        <div className="text-caption text-mute mt-2 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {schedule.jam_mulai} - {schedule.jam_selesai} WIB
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Teknisi Lapangan</div>
                        <div className="text-body-md-strong text-ink flex items-center gap-2">
                            <User className="w-4 h-4 text-mute shrink-0" />
                            {schedule.technician ? schedule.technician.name : <span className="text-mute italic">Belum ditugaskan</span>}
                        </div>
                        <div className="text-caption text-mute mt-2">
                            Supervisor: {schedule.supervisor ? schedule.supervisor.name : '-'}
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md p-6 shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="text-caption-mono uppercase text-mute mb-1">Layanan</div>
                        <div className="text-body-md-strong text-ink flex items-center gap-2 truncate">
                            <ShieldCheck className="w-4 h-4 text-mute shrink-0" />
                            <span className="truncate">{schedule.jenis_layanan}</span>
                        </div>
                        <div className="text-caption text-mute mt-2 truncate">
                            Kontrak: {schedule.contract ? schedule.contract.contract_number : 'Non-Kontrak / Sekali Jalan'}
                        </div>
                    </div>
                </div>

                {/* Detail Information Grid */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-6">
                    <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mute" />
                        Rincian Tugas & Alokasi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Kode Jadwal</div>
                            <div className="text-body-sm font-mono font-medium text-ink">{schedule.schedule_code}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Nama Customer</div>
                            <div className="text-body-sm font-medium text-ink flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-mute" />
                                {schedule.customer?.company_name} ({schedule.customer?.customer_id})
                            </div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Nomor Kontrak</div>
                            <div className="text-body-sm text-body-text font-mono">
                                {schedule.contract ? schedule.contract.contract_number : '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Jenis Layanan</div>
                            <div className="text-body-sm text-body-text">{schedule.jenis_layanan}</div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Prioritas Pekerjaan</div>
                            <div><PriorityBadge prioritas={schedule.prioritas} /></div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Status Pekerjaan</div>
                            <div><StatusBadge status={schedule.status} /></div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Teknisi Bertugas</div>
                            <div className="text-body-sm text-body-text">
                                {schedule.technician ? schedule.technician.name : <span className="text-mute italic">Belum ditugaskan</span>}
                            </div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Supervisor Penanggung Jawab</div>
                            <div className="text-body-sm text-body-text">
                                {schedule.supervisor ? schedule.supervisor.name : '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-caption-mono uppercase text-mute mb-1">Lokasi Detail</div>
                            <div className="text-body-sm text-body-text flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-mute shrink-0 mt-0.5" />
                                <span>{schedule.lokasi}</span>
                            </div>
                        </div>
                    </div>

                    {/* Catatan / Instruksi */}
                    {schedule.catatan && (
                        <div className="pt-4 border-t border-hairline">
                            <div className="text-caption-mono uppercase text-mute mb-2 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-mute" />
                                Catatan / Instruksi Khusus
                            </div>
                            <div className="bg-canvas-soft border border-hairline rounded-md p-4 text-body-sm text-ink whitespace-pre-line">
                                {schedule.catatan}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
