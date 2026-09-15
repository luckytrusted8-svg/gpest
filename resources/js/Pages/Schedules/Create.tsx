import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { useMemo, useState } from 'react';
import { Clock, MapPin, Sparkles, Building2, UserCheck, ShieldCheck, AlertCircle, CheckCircle2, Zap, Star, PenLine } from 'lucide-react';

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

interface TechnicianProfile {
    id: number;
    user_id: number;
    employee_id: string;
    nama: string;
    area_tugas: string | null;
    status: 'aktif' | 'tidak_aktif' | 'cuti';
    keahlian: string[] | null;
    telepon: string | null;
}

interface UserStaff {
    id: number;
    name: string;
    email: string;
    technician?: TechnicianProfile | null;
}

const KNOWN_AREAS = [
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Depok',
    'Tangerang Selatan',
    'Tangerang',
    'Bekasi',
    'Bogor',
    'Cikarang',
    'Karawang',
    'Bintaro',
    'BSD',
    'Serpong',
];

const detectAreaFromText = (text?: string): string => {
    if (!text) return '';
    const lower = text.toLowerCase();
    for (const a of KNOWN_AREAS) {
        if (lower.includes(a.toLowerCase())) {
            return a;
        }
    }
    return '';
};

const isAreaMatch = (techArea?: string | null, targetArea?: string): boolean => {
    if (!techArea || !targetArea) return false;
    const tLower = techArea.toLowerCase();
    const targetLower = targetArea.toLowerCase();
    return tLower.includes(targetLower) || targetLower.includes(tLower);
};

interface Props {
    customers: Customer[];
    contracts: Contract[];
    technicians: UserStaff[];
    supervisors: UserStaff[];
    users?: UserStaff[];
    prefilled?: {
        customer_id?: string;
        service?: string;
        priority?: string;
        notes?: string;
        request_id?: string;
    };
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

const normalizeService = (svc?: string): string => {
    if (!svc) return 'General Pest Control';
    const s = svc.toLowerCase();
    if (s.includes('fumi')) return 'Fumigasi';
    if (s.includes('termite') || s.includes('rayap')) return 'Termite Control';
    if (s.includes('rodent') || s.includes('tikus')) return 'Rodent Control';
    if (s.includes('insect') || s.includes('serangga') || s.includes('nyamuk')) return 'Insect Control';
    if (s.includes('disinfek') || s.includes('disinfection')) return 'Disinfection';
    if (s.includes('inspect') || s.includes('survey') || s.includes('survei')) return 'Inspection / Survey';
    if (s.includes('komplain')) return 'Komplain Penanganan';
    return svc;
};

const normalizePriority = (prio?: string): 'rendah' | 'normal' | 'tinggi' | 'urgent' => {
    if (!prio) return 'normal';
    const p = prio.toLowerCase();
    if (p === 'sedang' || p === 'normal' || p === 'medium') return 'normal';
    if (p === 'rendah' || p === 'low') return 'rendah';
    if (p === 'tinggi' || p === 'high') return 'tinggi';
    if (p === 'urgent' || p === 'darurat') return 'urgent';
    return 'normal';
};

export default function Create({ customers = [], contracts = [], technicians = [], supervisors = [], prefilled }: Props) {
    const today = new Date().toISOString().split('T')[0];

    // Read query parameters as fallback
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const reqCustomerId = prefilled?.customer_id || searchParams?.get('customer_id') || '';
    const reqService = prefilled?.service || searchParams?.get('service') || '';
    const reqPriority = prefilled?.priority || searchParams?.get('priority') || searchParams?.get('prioritas') || '';
    const reqNotes = prefilled?.notes || searchParams?.get('notes') || searchParams?.get('catatan') || '';
    const reqId = prefilled?.request_id || searchParams?.get('request_id') || '';
    const reqLocation = searchParams?.get('lokasi') || '';
    const reqSiteId = searchParams?.get('site_id') || '';

    // Auto-select target customer
    const initialCustomer = reqCustomerId
        ? customers.find((c) => String(c.id) === String(reqCustomerId)) || (customers.length > 0 ? customers[0] : null)
        : (customers.length > 0 ? customers[0] : null);

    const initialAddress = reqLocation || initialCustomer?.address || initialCustomer?.location || '';
    const initialService = reqService ? normalizeService(reqService) : 'General Pest Control';
    const initialPriority = reqPriority ? normalizePriority(reqPriority) : 'normal';
    const initialNotes = reqNotes ? (reqId ? `[Permintaan Tiket #${reqId}]: ${reqNotes}` : reqNotes) : '';

    const [is24HoursFlexible, setIs24HoursFlexible] = useState(false);
    const [locationSelection, setLocationSelection] = useState<string>(
        reqSiteId ? `site_${reqSiteId}` : reqLocation ? 'custom' : 'main'
    );
    const [isCustomLocation, setIsCustomLocation] = useState(Boolean(reqLocation && !reqSiteId));

    const { data, setData, post, processing, errors } = useForm<FormData>({
        schedule_code: `SCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
        customer_id: initialCustomer ? String(initialCustomer.id) : '',
        contract_id: '',
        lokasi: initialAddress,
        jenis_layanan: initialService,
        technician_id: '',
        supervisor_id: '',
        tanggal: today,
        jam_mulai: '08:00',
        jam_selesai: '17:00',
        prioritas: initialPriority,
        status: 'dijadwalkan',
        catatan: initialNotes,
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

    // Smart Area Matching: detect area from lokasi, site, or customer address
    const detectedJobArea = useMemo(() => {
        return (
            detectAreaFromText(data.lokasi) ||
            detectAreaFromText(selectedCustomer?.location) ||
            detectAreaFromText(selectedCustomer?.address) ||
            ''
        );
    }, [data.lokasi, selectedCustomer]);

    const { recommendedTechnicians, otherTechnicians } = useMemo(() => {
        if (!detectedJobArea) {
            return { recommendedTechnicians: [], otherTechnicians: technicians };
        }
        const rec: UserStaff[] = [];
        const oth: UserStaff[] = [];
        technicians.forEach((t) => {
            if (isAreaMatch(t.technician?.area_tugas, detectedJobArea)) {
                rec.push(t);
            } else {
                oth.push(t);
            }
        });
        return { recommendedTechnicians: rec, otherTechnicians: oth };
    }, [technicians, detectedJobArea]);

    const selectedTech = useMemo(() => {
        return technicians.find((t) => String(t.id) === String(data.technician_id));
    }, [technicians, data.technician_id]);

    const handleCustomerChange = (val: string) => {
        const cust = customers.find((c) => String(c.id) === val);
        const autoAddress = cust?.address || cust?.location || '';

        setData((prev) => ({
            ...prev,
            customer_id: val,
            contract_id: '', // reset contract when customer changes
            lokasi: autoAddress || prev.lokasi, // auto fill lokasi from customer
        }));
        setLocationSelection('main');
        setIsCustomLocation(false);
    };

    const handleLocationSelect = (val: string) => {
        if (val === 'main') {
            const mainAddress = selectedCustomer?.address || selectedCustomer?.location || '';
            setData('lokasi', mainAddress);
            setLocationSelection('main');
            setIsCustomLocation(false);
        } else if (val === 'custom') {
            setLocationSelection('custom');
            setIsCustomLocation(true);
        } else if (val.startsWith('site_')) {
            const siteId = Number(val.replace('site_', ''));
            const site = selectedCustomer?.sites?.find((s) => s.id === siteId);
            const siteAddr = site ? (site.address ? `${site.site_name} - ${site.address}` : site.site_name) : '';
            setData('lokasi', siteAddr);
            setLocationSelection(val);
            setIsCustomLocation(false);
        }
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

                {reqId && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-xs">
                        <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-1">
                            <div className="font-bold text-blue-950 flex items-center gap-2">
                                <span>Konversi Otomatis dari Tiket Request Klien #{reqId}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-200/80 text-blue-800 font-bold uppercase">
                                    {data.jenis_layanan}
                                </span>
                            </div>
                            <p className="text-blue-800 leading-relaxed">
                                Pelanggan, jenis layanan, tingkat prioritas, dan catatan keluhan telah disesuaikan secara otomatis sesuai permintaan klien.
                            </p>
                        </div>
                    </div>
                )}

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

                            {/* Lokasi Pekerjaan (Dropdown Rapi Membedakan Lokasi Utama vs Cabang) */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="lokasi" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Lokasi Pekerjaan</span>
                                    </Label>
                                    <span className="text-[10px] text-slate-400 font-medium">Pilihan Dropdown</span>
                                </div>

                                <div className="mt-1.5 space-y-2">
                                    <Select
                                        value={locationSelection}
                                        onValueChange={handleLocationSelect}
                                    >
                                        <SelectTrigger className="text-xs">
                                            <SelectValue placeholder="Pilih Lokasi Pekerjaan" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            {/* Grup 1: Lokasi Utama Perusahaan */}
                                            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
                                                <Building2 className="w-3 h-3 text-blue-600" />
                                                <span>Lokasi Utama Perusahaan</span>
                                            </div>
                                            <SelectItem value="main" className="cursor-pointer py-2">
                                                <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">LOKASI UTAMA</span>
                                                        Kantor Pusat
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                                        {selectedCustomer?.address || selectedCustomer?.location || 'Alamat Kantor Utama Customer'}
                                                    </span>
                                                </div>
                                            </SelectItem>

                                            {/* Grup 2: Cabang / Titik Lokasi (Sites) */}
                                            {selectedCustomer?.sites && selectedCustomer.sites.length > 0 ? (
                                                <>
                                                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-y border-slate-100 flex items-center gap-1.5 mt-1">
                                                        <MapPin className="w-3 h-3 text-emerald-600" />
                                                        <span>Cabang / Titik Lokasi ({selectedCustomer.sites.length} Cabang)</span>
                                                    </div>
                                                    {selectedCustomer.sites.map((site) => (
                                                        <SelectItem key={`site_${site.id}`} value={`site_${site.id}`} className="cursor-pointer py-2">
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">CABANG</span>
                                                                    {site.site_name}
                                                                </span>
                                                                {site.address && (
                                                                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                                                        {site.address}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="px-3 py-1.5 text-[11px] text-slate-400 italic bg-slate-50/50">
                                                    * Pelanggan ini belum memiliki data cabang / site terdaftar
                                                </div>
                                            )}

                                            {/* Grup 3: Manual Input */}
                                            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-y border-slate-100 flex items-center gap-1.5 mt-1">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                <span>Alamat Khusus Lainnya</span>
                                            </div>
                                            <SelectItem value="custom" className="cursor-pointer py-2 text-xs font-medium text-slate-700">
                                                <span className="flex items-center gap-1.5">
                                                    <PenLine className="w-3.5 h-3.5 text-slate-500" />
                                                    Tulis Alamat Manual / Lokasi Khusus...
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Preview Alamat Terpilih atau Input Manual */}
                                    {isCustomLocation ? (
                                        <div className="space-y-1 pt-1">
                                            <Input
                                                id="lokasi"
                                                type="text"
                                                value={data.lokasi}
                                                onChange={(e) => setData('lokasi', e.target.value)}
                                                placeholder="Tuliskan alamat lengkap lokasi pekerjaan..."
                                                className="text-xs"
                                                required
                                            />
                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span>Masukkan alamat khusus atau area spesifik</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleLocationSelect('main')}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Kembali ke Alamat Utama
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start justify-between gap-2 text-xs">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Alamat Lengkap Terpilih:
                                                </span>
                                                <p className="text-slate-800 font-medium leading-relaxed">
                                                    {data.lokasi || 'Belum ada alamat lokasi'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLocationSelection('custom');
                                                    setIsCustomLocation(true);
                                                }}
                                                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold shrink-0"
                                            >
                                                Edit Manual
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                        <SelectItem value="General Pest Control">General Pest Control (Hama Umum)</SelectItem>
                                        <SelectItem value="Termite Control">Termite Control (Rayap)</SelectItem>
                                        <SelectItem value="Rodent Control">Rodent Control (Tikus)</SelectItem>
                                        <SelectItem value="Insect Control">Insect Control (Serangga/Nyamuk)</SelectItem>
                                        <SelectItem value="Fumigasi">Fumigasi</SelectItem>
                                        <SelectItem value="Disinfection">Disinfection (Disinfeksi)</SelectItem>
                                        <SelectItem value="Inspection / Survey">Inspection / Survey</SelectItem>
                                        <SelectItem value="Komplain Penanganan">Komplain Penanganan</SelectItem>
                                        {!['General Pest Control', 'Termite Control', 'Rodent Control', 'Insect Control', 'Fumigasi', 'Disinfection', 'Inspection / Survey', 'Komplain Penanganan'].includes(data.jenis_layanan) && data.jenis_layanan && (
                                            <SelectItem value={data.jenis_layanan}>{data.jenis_layanan}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.jenis_layanan && <div className="text-rose-600 text-xs mt-1">{errors.jenis_layanan}</div>}
                            </div>

                            {/* Teknisi Lapangan (Hanya Karyawan Lapangan) */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="technician_id" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Teknisi Pelaksana Lapangan</span>
                                    </Label>
                                    {detectedJobArea && (
                                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-blue-600" /> Zona Lokasi: {detectedJobArea}
                                        </span>
                                    )}
                                </div>

                                {detectedJobArea && recommendedTechnicians.length > 0 && !data.technician_id && (
                                    <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>
                                                Teknisi siap untuk area <strong>{detectedJobArea}</strong>:{' '}
                                                <strong>{recommendedTechnicians[0].name}</strong> ({recommendedTechnicians[0].technician?.area_tugas || detectedJobArea})
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('technician_id', String(recommendedTechnicians[0].id))}
                                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
                                        >
                                            <Zap className="w-3 h-3 fill-white" /> Tugaskan Otomatis
                                        </button>
                                    </div>
                                )}

                                <Select
                                    value={data.technician_id}
                                    onValueChange={(val: string) => setData('technician_id', val)}
                                >
                                    <SelectTrigger className="text-xs">
                                        <SelectValue placeholder="Pilih Teknisi Pelaksana Lapangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recommendedTechnicians.length > 0 && (
                                            <>
                                                <div className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border-y border-emerald-100 flex items-center gap-1 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                                        REKOMENDASI SESUAI ZONA ({detectedJobArea})
                                                    </span>
                                                </div>
                                                {recommendedTechnicians.map((u) => (
                                                    <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer py-2">
                                                        <div className="flex items-center justify-between gap-2 w-full">
                                                            <span className="font-semibold text-slate-900">{u.name}</span>
                                                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                                Area: {u.technician?.area_tugas || detectedJobArea} (Siap)
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-50 border-y border-slate-100 flex items-center gap-1 uppercase tracking-wider mt-1">
                                                    <span>TEKNISI ZONA LAINNYA</span>
                                                </div>
                                            </>
                                        )}
                                        {otherTechnicians.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)} className="cursor-pointer py-2">
                                                <div className="flex items-center justify-between gap-2 w-full">
                                                    <span className="text-slate-800">{u.name}</span>
                                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {u.technician?.area_tugas ? `Area: ${u.technician.area_tugas}` : 'Area Umum'}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedTech && detectedJobArea && !isAreaMatch(selectedTech.technician?.area_tugas, detectedJobArea) && (
                                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 mt-1.5">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold">Catatan Perbedaan Wilayah:</span> Teknisi <strong>{selectedTech.name}</strong> memiliki area tugas di <strong>{selectedTech.technician?.area_tugas || 'Belum Ditentukan'}</strong>, sedangkan lokasi pekerjaan client berada di <strong>{detectedJobArea}</strong>. Tetap lanjutkan jika sedang rolling tugas antar zona.
                                        </div>
                                    </div>
                                )}

                                {errors.technician_id && <div className="text-rose-600 text-xs mt-1">{errors.technician_id}</div>}
                            </div>

                            {/* Koordinator / Supervisor Lapangan */}
                            <div>
                                <Label htmlFor="supervisor_id" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Koordinator / Supervisor Lapangan</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-normal">Opsional (Boleh Kosong)</span>
                                </Label>
                                <Select
                                    value={data.supervisor_id || 'none'}
                                    onValueChange={(val: string) => setData('supervisor_id', val === 'none' ? '' : val)}
                                >
                                    <SelectTrigger className="mt-1.5 text-xs">
                                        <SelectValue placeholder="Pilih Koordinator / Supervisor (Opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" className="italic text-slate-500">
                                            -- Tanpa Koordinator (Teknisi Mandiri) --
                                        </SelectItem>
                                        {supervisors.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Petugas pengawas lapangan yang bertugas mendampingi & memverifikasi laporan kerja. Kosongkan jika pekerjaan rutin tanpa supervisi.
                                </p>
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
                                        <SelectItem value="normal">Normal (Sedang)</SelectItem>
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
