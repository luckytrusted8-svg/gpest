import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { useMemo, useState } from 'react';
import { Clock, MapPin, Sparkles, Building2, UserCheck, ShieldCheck } from 'lucide-react';

interface SiteItem {
    id: number;
    site_name: string;
    address?: string;
    location?: string;
}

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
    address?: string;
    location?: string;
    sites?: SiteItem[];
}

interface Contract {
    id: number;
    contract_number: string;
    customer_id: number;
    service_type: string;
}

interface UserStaff {
    id: number;
    name: string;
    email: string;
}

interface Props {
    customers: Customer[];
    contracts: Contract[];
    technicians: UserStaff[];
    supervisors: UserStaff[];
    users?: UserStaff[];
}

interface FormData {
    schedule_code: string;
    customer_id: string;
    contract_id: string;
    lokasi: string;
    jenis_layanan: string;
    technician_id: string;
    supervisor_id: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent';
    status: 'dijadwalkan' | 'ditugaskan' | 'dalam_perjalanan' | 'tiba' | 'sedang_dikerjakan' | 'selesai' | 'dibatalkan' | 'dijadwal_ulang';
    catatan: string;
}

export default function Create({ customers = [], contracts = [], technicians = [], supervisors = [] }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const initialCustomer = customers.length > 0 ? customers[0] : null;
    const initialAddress = initialCustomer?.address || initialCustomer?.location || '';

    const [is24HoursFlexible, setIs24HoursFlexible] = useState(false);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        schedule_code: `SCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        customer_id: initialCustomer ? String(initialCustomer.id) : '',
        contract_id: '',
        lokasi: initialAddress,
        jenis_layanan: 'General Pest Control',
        technician_id: '',
        supervisor_id: '',
        tanggal: today,
        jam_mulai: '08:00',
        jam_selesai: '17:00',
        prioritas: 'normal',
        status: 'dijadwalkan',
        catatan: '',
    });

    // Dynamic contracts filtered by selected customer
    const filteredContracts = useMemo(() => {
        if (!data.customer_id) return [];
        return contracts.filter((c) => String(c.customer_id) === String(data.customer_id));
    }, [contracts, data.customer_id]);

    // Current selected customer object
    const selectedCustomer = useMemo(() => {
        return customers.find((c) => String(c.id) === String(data.customer_id));
    }, [customers, data.customer_id]);

    const handleCustomerChange = (val: string) => {
        const cust = customers.find((c) => String(c.id) === val);
        const autoAddress = cust?.address || cust?.location || '';

        setData((prev) => ({
            ...prev,
            customer_id: val,
            contract_id: '', // reset contract when customer changes
            lokasi: autoAddress || prev.lokasi, // auto fill lokasi from customer
        }));
    };

    const handleToggleFlexibleTime = (checked: boolean) => {
        setIs24HoursFlexible(checked);
        if (checked) {
            setData((prev) => ({
                ...prev,
                jam_mulai: '00:00',
                jam_selesai: '23:59',
            }));
        } else {
            setData((prev) => ({
                ...prev,
                jam_mulai: '08:00',
                jam_selesai: '17:00',
            }));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schedules.store'));
    };

    return (
        <AppLayout>
            <Head title="Buat Jadwal Baru - G-PEST" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Buat Jadwal Baru</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Isi formulir berikut untuk menambahkan penugasan jadwal teknisi lapangan.</p>
                    </div>
                    <Link href={route('schedules.index')}>
                        <Button variant="outline" className="text-xs">
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kode Jadwal */}
                            <div>
                                <Label htmlFor="schedule_code" className="text-xs font-semibold text-slate-700">Kode Jadwal</Label>
                                <Input
                                    id="schedule_code"
                                    type="text"
                                    value={data.schedule_code}
                                    onChange={(e) => setData('schedule_code', e.target.value)}
                                    className="mt-1.5 font-mono text-xs"
                                    required
                                />
                                {errors.schedule_code && <div className="text-rose-600 text-xs mt-1">{errors.schedule_code}</div>}
                            </div>

                            {/* Customer (Pelanggan) */}
                            <div>
                                <Label htmlFor="customer_id" className="text-xs font-semibold text-slate-700">Customer (Pelanggan)</Label>
                                <Select
                                    value={data.customer_id}
                                    onValueChange={handleCustomerChange}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Pelanggan Terdaftar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((cust) => (
                                            <SelectItem key={cust.id} value={String(cust.id)}>
                                                {cust.company_name} ({cust.customer_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <div className="text-rose-600 text-xs mt-1">{errors.customer_id}</div>}
                            </div>

                            {/* Kontrak Terkait */}
                            <div>
                                <Label htmlFor="contract_id" className="text-xs font-semibold text-slate-700">Kontrak Layanan (Opsional)</Label>
                                <Select
                                    value={data.contract_id}
                                    onValueChange={(val: string) => setData('contract_id', val)}
                                    disabled={filteredContracts.length === 0}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder={filteredContracts.length > 0 ? "Pilih Kontrak Terkait" : "Tidak ada kontrak untuk customer ini"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredContracts.map((ctr) => (
                                            <SelectItem key={ctr.id} value={String(ctr.id)}>
                                                {ctr.contract_number} ({ctr.service_type})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.contract_id && <div className="text-rose-600 text-xs mt-1">{errors.contract_id}</div>}
                            </div>

                            {/* Lokasi Pekerjaan (Otomatis dari Customer) */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="lokasi" className="text-xs font-semibold text-slate-700">Lokasi Pekerjaan</Label>
                                    {selectedCustomer && (selectedCustomer.address || selectedCustomer.location) && (
                                        <button
                                            type="button"
                                            onClick={() => setData('lokasi', selectedCustomer.address || selectedCustomer.location || '')}
                                            className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
                                            title="Gunakan alamat utama pelanggan"
                                        >
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span>Pakai Alamat Customer</span>
                                        </button>
                                    )}
                                </div>
                                <Input
                                    id="lokasi"
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Alamat / Gedung / Titik Area Lokasi"
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {selectedCustomer?.sites && selectedCustomer.sites.length > 0 && (
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] text-slate-400 font-mono">Pilih Titik Site:</span>
                                        {selectedCustomer.sites.map((site) => (
                                            <button
                                                key={site.id}
                                                type="button"
                                                onClick={() => setData('lokasi', `${site.site_name} - ${site.address || site.location || ''}`)}
                                                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium transition-colors"
                                            >
                                                {site.site_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {errors.lokasi && <div className="text-rose-600 text-xs mt-1">{errors.lokasi}</div>}
                            </div>

                            {/* Jenis Layanan */}
                            <div>
                                <Label htmlFor="jenis_layanan" className="text-xs font-semibold text-slate-700">Jenis Layanan</Label>
                                <Select
                                    value={data.jenis_layanan}
                                    onValueChange={(val: string) => setData('jenis_layanan', val)}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Jenis Layanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General Pest Control">General Pest Control</SelectItem>
                                        <SelectItem value="Termite Control">Termite Control</SelectItem>
                                        <SelectItem value="Rodent Control">Rodent Control</SelectItem>
                                        <SelectItem value="Insect Control">Insect Control</SelectItem>
                                        <SelectItem value="Fumigation">Fumigation</SelectItem>
                                        <SelectItem value="Disinfection">Disinfection</SelectItem>
                                        <SelectItem value="Inspection / Survey">Inspection / Survey</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenis_layanan && <div className="text-rose-600 text-xs mt-1">{errors.jenis_layanan}</div>}
                            </div>

                            {/* Teknisi Lapangan (Hanya Teknisi Terdaftar) */}
                            <div>
                                <Label htmlFor="technician_id" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Teknisi Lapangan</span>
                                </Label>
                                <Select
                                    value={data.technician_id}
                                    onValueChange={(val: string) => setData('technician_id', val)}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Teknisi Lapangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {technicians.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.technician_id && <div className="text-rose-600 text-xs mt-1">{errors.technician_id}</div>}
                            </div>

                            {/* Supervisor (Hanya Supervisor / Admin) */}
                            <div>
                                <Label htmlFor="supervisor_id" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Supervisor (Opsional)</span>
                                </Label>
                                <Select
                                    value={data.supervisor_id}
                                    onValueChange={(val: string) => setData('supervisor_id', val)}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Supervisor Penanggung Jawab" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supervisors.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.supervisor_id && <div className="text-rose-600 text-xs mt-1">{errors.supervisor_id}</div>}
                            </div>

                            {/* Tanggal Pekerjaan */}
                            <div>
                                <Label htmlFor="tanggal" className="text-xs font-semibold text-slate-700">Tanggal Pekerjaan</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className="mt-1.5 text-xs"
                                    required
                                />
                                {errors.tanggal && <div className="text-rose-600 text-xs mt-1">{errors.tanggal}</div>}
                            </div>

                            {/* Pengaturan Jam Operasional (24 Jam / Fleksibel) */}
                            <div className="md:col-span-2 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                                        <span className="text-xs font-semibold text-slate-900">Waktu & Jam Penugasan (Fleksibel 24 Jam)</span>
                                    </div>
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={is24HoursFlexible}
                                            onChange={(e) => handleToggleFlexibleTime(e.target.checked)}
                                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 h-4 w-4"
                                        />
                                        <span className="font-medium">Mode Fleksibel / Panggilan Siaga (Standby 24 Jam)</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <Label htmlFor="jam_mulai" className="text-[11px] font-medium text-slate-600">Jam Mulai</Label>
                                        <Input
                                            id="jam_mulai"
                                            type="time"
                                            value={data.jam_mulai}
                                            onChange={(e) => setData('jam_mulai', e.target.value)}
                                            disabled={is24HoursFlexible}
                                            className="mt-1 text-xs bg-white"
                                            required
                                        />
                                        {errors.jam_mulai && <div className="text-rose-600 text-xs mt-1">{errors.jam_mulai}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="jam_selesai" className="text-[11px] font-medium text-slate-600">Jam Selesai</Label>
                                        <Input
                                            id="jam_selesai"
                                            type="time"
                                            value={data.jam_selesai}
                                            onChange={(e) => setData('jam_selesai', e.target.value)}
                                            disabled={is24HoursFlexible}
                                            className="mt-1 text-xs bg-white"
                                            required
                                        />
                                        {errors.jam_selesai && <div className="text-rose-600 text-xs mt-1">{errors.jam_selesai}</div>}
                                    </div>
                                </div>
                                {is24HoursFlexible && (
                                    <p className="text-[11px] text-slate-500 italic">
                                        * Jam diset otomatis standby 24 jam (00:00 - 23:59). Teknisi dapat memulai pekerjaan kapan saja sesuai panggilan kedatangan.
                                    </p>
                                )}
                            </div>

                            {/* Prioritas */}
                            <div>
                                <Label htmlFor="prioritas" className="text-xs font-semibold text-slate-700">Prioritas Pekerjaan</Label>
                                <Select
                                    value={data.prioritas}
                                    onValueChange={(val: string) => setData('prioritas', val as FormData['prioritas'])}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Prioritas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rendah">Rendah</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="tinggi">Tinggi</SelectItem>
                                        <SelectItem value="urgent">Urgent / Darurat</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.prioritas && <div className="text-rose-600 text-xs mt-1">{errors.prioritas}</div>}
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status" className="text-xs font-semibold text-slate-700">Status Awal Jadwal</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: string) => setData('status', val as FormData['status'])}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                                        <SelectItem value="ditugaskan">Ditugaskan</SelectItem>
                                        <SelectItem value="dalam_perjalanan">Dalam Perjalanan</SelectItem>
                                        <SelectItem value="tiba">Tiba di Lokasi</SelectItem>
                                        <SelectItem value="sedang_dikerjakan">Sedang Dikerjakan</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                        <SelectItem value="dijadwal_ulang">Dijadwal Ulang</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <div className="text-rose-600 text-xs mt-1">{errors.status}</div>}
                            </div>
                        </div>

                        {/* Catatan Khusus */}
                        <div>
                            <Label htmlFor="catatan" className="text-xs font-semibold text-slate-700">Catatan / Instruksi Khusus (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                value={data.catatan}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan', e.target.value)}
                                placeholder="Tulis catatan atau instruksi khusus untuk teknisi..."
                                className="mt-1.5 min-h-[90px] text-xs"
                            />
                            {errors.catatan && <div className="text-rose-600 text-xs mt-1">{errors.catatan}</div>}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3 pt-5 border-t border-slate-200">
                            <Link href={route('schedules.index')}>
                                <Button type="button" variant="outline" className="text-xs">
                                    Batal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Jadwal Baru'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
