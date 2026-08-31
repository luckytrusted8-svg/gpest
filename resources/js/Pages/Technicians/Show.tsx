import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { StatusBadge } from './Index';
import { PriorityBadge, StatusBadge as ScheduleStatusBadge } from '../Schedules/Index';
import { User, Phone, Mail, MapPin, Briefcase, Calendar, ShieldCheck, ArrowLeft, Edit, Clock } from 'lucide-react';

interface UserAccount {
    id: number;
    name: string;
    email: string;
}

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
    customer?: Customer;
    lokasi: string;
    jenis_layanan: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
}

interface Technician {
    id: number;
    user_id: number | null;
    user?: UserAccount;
    employee_id: string;
    nama: string;
    telepon: string;
    email: string;
    jabatan: string;
    status: 'aktif' | 'tidak_aktif' | 'cuti';
    area_tugas: string | null;
    keahlian: string[] | null;
    tanggal_bergabung: string;
    foto_profil: string | null;
    schedules?: Schedule[];
    created_at: string;
    updated_at: string;
}

interface Props {
    technician: Technician;
}

export default function Show({ technician }: Props) {
    return (
        <AppLayout>
            <Head title={`Profil Teknisi: ${technician.nama}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('technicians.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-display-sm font-semibold text-ink">{technician.nama}</h1>
                                <StatusBadge status={technician.status} />
                            </div>
                            <p className="text-body-sm text-mute mt-0.5 font-mono">
                                ID Karyawan: <span className="font-semibold text-ink">{technician.employee_id}</span> • {technician.jabatan}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href={route('technicians.edit', technician.id)}>
                            <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit Profil
                            </Button>
                        </Link>
                        <Link href={route('technicians.index')}>
                            <Button variant="outline" className="text-body-sm-strong">
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Profile Card Summary */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    {technician.foto_profil ? (
                        <img src={technician.foto_profil} alt={technician.nama} className="w-20 h-20 rounded-full object-cover border border-hairline shrink-0" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-xl font-bold text-ink shrink-0">
                            {technician.nama.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div className="space-y-1 flex-1">
                        <h2 className="text-body-md-strong text-ink">{technician.nama}</h2>
                        <div className="flex flex-wrap gap-4 text-body-sm text-body-text">
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-mute" />
                                <span>{technician.telepon}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-mute" />
                                <span>{technician.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-mute" />
                                <span>{technician.area_tugas || 'Belum ditentukan'}</span>
                            </div>
                        </div>
                        <div className="text-caption text-mute pt-1">
                            Tanggal Bergabung: <span className="font-medium text-ink">{technician.tanggal_bergabung}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="informasi" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-canvas-soft rounded-md p-1 border border-hairline">
                        <TabsTrigger value="informasi" className="text-body-sm-strong">Informasi Lengkap</TabsTrigger>
                        <TabsTrigger value="jadwal" className="text-body-sm-strong">Jadwal Pekerjaan ({technician.schedules?.length || 0})</TabsTrigger>
                        <TabsTrigger value="kehadiran" className="text-body-sm-strong">Catatan Kehadiran</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Informasi */}
                    <TabsContent value="informasi" className="mt-4 space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-6">
                            <h3 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3">
                                Biodata & Kualifikasi Teknisi
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">ID Karyawan</div>
                                    <div className="text-body-sm font-mono font-medium text-ink">{technician.employee_id}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Nama Lengkap</div>
                                    <div className="text-body-sm font-medium text-ink">{technician.nama}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Jabatan</div>
                                    <div className="text-body-sm text-body-text">{technician.jabatan}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Telepon</div>
                                    <div className="text-body-sm text-body-text">{technician.telepon}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Email</div>
                                    <div className="text-body-sm text-body-text">{technician.email}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Area Tugas Operasional</div>
                                    <div className="text-body-sm text-body-text">{technician.area_tugas || '-'}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Status Karyawan</div>
                                    <div><StatusBadge status={technician.status} /></div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Tanggal Bergabung</div>
                                    <div className="text-body-sm text-body-text">{technician.tanggal_bergabung}</div>
                                </div>

                                <div>
                                    <div className="text-caption-mono uppercase text-mute mb-1">Akun Pengguna Tautan</div>
                                    <div className="text-body-sm text-body-text">
                                        {technician.user ? (
                                            <span className="font-medium text-ink">{technician.user.name} ({technician.user.email})</span>
                                        ) : (
                                            <span className="text-mute italic">Tidak ditautkan ke akun login</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Keahlian list */}
                            <div className="pt-4 border-t border-hairline">
                                <div className="text-caption-mono uppercase text-mute mb-3 flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-mute" />
                                    Daftar Keahlian & Spesialisasi
                                </div>
                                {technician.keahlian && technician.keahlian.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {technician.keahlian.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-canvas-soft border border-hairline rounded-md text-body-sm font-medium text-ink">
                                                ✓ {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-body-sm text-mute italic">Belum ada data keahlian.</div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 2: Jadwal */}
                    <TabsContent value="jadwal" className="mt-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                            <div className="p-4 border-b border-hairline bg-canvas-soft flex justify-between items-center">
                                <h3 className="text-body-sm-strong text-ink uppercase tracking-wide">
                                    Riwayat & Agenda Tugas Teknisi
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                            <th className="py-3 px-4 font-semibold">Kode</th>
                                            <th className="py-3 px-4 font-semibold">Customer & Lokasi</th>
                                            <th className="py-3 px-4 font-semibold">Layanan</th>
                                            <th className="py-3 px-4 font-semibold">Tanggal & Waktu</th>
                                            <th className="py-3 px-4 font-semibold">Prioritas</th>
                                            <th className="py-3 px-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                        {technician.schedules && technician.schedules.length > 0 ? (
                                            technician.schedules.map((sch) => (
                                                <tr key={sch.id} className="hover:bg-canvas-soft/50 transition-colors">
                                                    <td className="py-3 px-4 font-mono font-medium">
                                                        <Link href={`/schedules/${sch.id}`} className="text-link hover:underline">
                                                            {sch.schedule_code}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-medium">{sch.customer?.company_name || '-'}</div>
                                                        <div className="text-xs text-mute truncate max-w-[200px]">{sch.lokasi}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-body-text">{sch.jenis_layanan}</td>
                                                    <td className="py-3 px-4 text-body-text">
                                                        <div>{sch.tanggal}</div>
                                                        <div className="text-xs text-mute">{sch.jam_mulai} - {sch.jam_selesai}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <PriorityBadge prioritas={sch.prioritas} />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <ScheduleStatusBadge status={sch.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-mute text-body-sm">
                                                    Belum ada jadwal pekerjaan yang ditugaskan kepada teknisi ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Tab 3: Kehadiran (Empty State Placeholder) */}
                    <TabsContent value="kehadiran" className="mt-4">
                        <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-8 text-center space-y-3">
                            <Clock className="w-10 h-10 text-mute mx-auto opacity-60" />
                            <h3 className="text-body-sm-strong text-ink">Catatan Kehadiran Teknisi</h3>
                            <p className="text-body-sm text-mute max-w-md mx-auto">
                                Modul presensi dan lokasi check-in/check-out teknisi lapangan akan terintegrasi pada modul Attendance & Location Tracking.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
