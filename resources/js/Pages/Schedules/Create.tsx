import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { useMemo } from 'react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
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
    users: UserStaff[];
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

export default function Create({ customers, contracts, users }: Props) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm<FormData>({
        schedule_code: `SCH-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`,
        customer_id: customers.length > 0 ? String(customers[0].id) : '',
        contract_id: '',
        lokasi: '',
        jenis_layanan: 'General Pest Control',
        technician_id: '',
        supervisor_id: '',
        tanggal: today,
        jam_mulai: '08:00',
        jam_selesai: '10:00',
        prioritas: 'normal',
        status: 'dijadwalkan',
        catatan: '',
    });

    // Dynamic contracts filtered by selected customer
    const filteredContracts = useMemo(() => {
        if (!data.customer_id) return [];
        return contracts.filter((c) => String(c.customer_id) === String(data.customer_id));
    }, [contracts, data.customer_id]);

    const handleCustomerChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            customer_id: val,
            contract_id: '', // reset contract when customer changes
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('schedules.store'));
    };

    return (
        <AppLayout>
            <Head title="Buat Jadwal Pekerjaan" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Buat Jadwal Baru</h1>
                        <p className="text-body-sm text-mute mt-1">Isi formulir berikut untuk menambahkan jadwal tugas teknisi.</p>
                    </div>
                    <Link href={route('schedules.index')}>
                        <Button variant="outline" className="text-body-sm-strong">
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="schedule_code" className="text-body-sm-strong text-ink">Kode Jadwal</Label>
                                <Input
                                    id="schedule_code"
                                    type="text"
                                    value={data.schedule_code}
                                    onChange={(e) => setData('schedule_code', e.target.value)}
                                    className="mt-1 font-mono"
                                />
                                {errors.schedule_code && <div className="text-error text-sm mt-1">{errors.schedule_code}</div>}
                            </div>

                            <div>
                                <Label htmlFor="customer_id" className="text-body-sm-strong text-ink">Customer (Pelanggan)</Label>
                                <Select
                                    value={data.customer_id}
                                    onValueChange={handleCustomerChange}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((cust) => (
                                            <SelectItem key={cust.id} value={String(cust.id)}>
                                                {cust.company_name} ({cust.customer_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <div className="text-error text-sm mt-1">{errors.customer_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="contract_id" className="text-body-sm-strong text-ink">Kontrak (Opsional)</Label>
                                <Select
                                    value={data.contract_id}
                                    onValueChange={(val: string) => setData('contract_id', val)}
                                    disabled={filteredContracts.length === 0}
                                >
                                    <SelectTrigger className="mt-1">
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
                                {errors.contract_id && <div className="text-error text-sm mt-1">{errors.contract_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="lokasi" className="text-body-sm-strong text-ink">Lokasi Pekerjaan</Label>
                                <Input
                                    id="lokasi"
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Alamat / Gedung / Area Pekerjaan"
                                    className="mt-1"
                                />
                                {errors.lokasi && <div className="text-error text-sm mt-1">{errors.lokasi}</div>}
                            </div>

                            <div>
                                <Label htmlFor="jenis_layanan" className="text-body-sm-strong text-ink">Jenis Layanan</Label>
                                <Select
                                    value={data.jenis_layanan}
                                    onValueChange={(val: string) => setData('jenis_layanan', val)}
                                >
                                    <SelectTrigger className="mt-1">
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
                                {errors.jenis_layanan && <div className="text-error text-sm mt-1">{errors.jenis_layanan}</div>}
                            </div>

                            <div>
                                <Label htmlFor="technician_id" className="text-body-sm-strong text-ink">Teknisi Lapangan</Label>
                                <Select
                                    value={data.technician_id}
                                    onValueChange={(val: string) => setData('technician_id', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Teknisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.technician_id && <div className="text-error text-sm mt-1">{errors.technician_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="supervisor_id" className="text-body-sm-strong text-ink">Supervisor (Opsional)</Label>
                                <Select
                                    value={data.supervisor_id}
                                    onValueChange={(val: string) => setData('supervisor_id', val)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Supervisor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.supervisor_id && <div className="text-error text-sm mt-1">{errors.supervisor_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="tanggal" className="text-body-sm-strong text-ink">Tanggal Pekerjaan</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.tanggal && <div className="text-error text-sm mt-1">{errors.tanggal}</div>}
                            </div>

                            <div>
                                <Label htmlFor="jam_mulai" className="text-body-sm-strong text-ink">Jam Mulai</Label>
                                <Input
                                    id="jam_mulai"
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.jam_mulai && <div className="text-error text-sm mt-1">{errors.jam_mulai}</div>}
                            </div>

                            <div>
                                <Label htmlFor="jam_selesai" className="text-body-sm-strong text-ink">Jam Selesai</Label>
                                <Input
                                    id="jam_selesai"
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.jam_selesai && <div className="text-error text-sm mt-1">{errors.jam_selesai}</div>}
                            </div>

                            <div>
                                <Label htmlFor="prioritas" className="text-body-sm-strong text-ink">Prioritas Pekerjaan</Label>
                                <Select
                                    value={data.prioritas}
                                    onValueChange={(val: string) => setData('prioritas', val as FormData['prioritas'])}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Pilih Prioritas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="rendah">Rendah</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="tinggi">Tinggi</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.prioritas && <div className="text-error text-sm mt-1">{errors.prioritas}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-body-sm-strong text-ink">Status Jadwal</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val: string) => setData('status', val as FormData['status'])}
                                >
                                    <SelectTrigger className="mt-1">
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
                                {errors.status && <div className="text-error text-sm mt-1">{errors.status}</div>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="catatan" className="text-body-sm-strong text-ink">Catatan / Instruksi Khusus (Opsional)</Label>
                            <Textarea
                                id="catatan"
                                value={data.catatan}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan', e.target.value)}
                                placeholder="Masukkan catatan atau instruksi khusus untuk teknisi..."
                                className="mt-1 min-h-[90px]"
                            />
                            {errors.catatan && <div className="text-error text-sm mt-1">{errors.catatan}</div>}
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-hairline">
                            <Link href={route('schedules.index')}>
                                <Button type="button" variant="outline" className="text-body-sm-strong">
                                    Batal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
                            >
                                Simpan Jadwal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
