import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { useState } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Briefcase,
    Search as SearchIcon,
    Wrench,
    Camera,
    Image as ImageIcon,
    ClipboardList,
    X,
} from 'lucide-react';

interface Customer {
    id: number;
    customer_id: string;
    company_name: string;
}

interface Technician {
    id: number;
    name: string;
}

interface Contract {
    id: number;
    contract_number: string;
    customer_id: number;
    contract_type: string;
}

interface Schedule {
    id: number;
    schedule_code: string;
    customer_id: number;
    technician_id?: number | null;
    contract_id?: number | null;
    tanggal: string;
    jenis_layanan: string;
    jam_mulai?: string | null;
    jam_selesai?: string | null;
}

interface Props {
    customers: Customer[];
    technicians: Technician[];
    contracts: Contract[];
    schedules: Schedule[];
    nomorLaporan: string;
    prefilled?: {
        schedule_id?: string;
        customer_id?: string;
        technician_id?: string;
        contract_id?: string;
        jenis_layanan?: string;
        tanggal?: string;
        jam_mulai?: string;
        jam_selesai?: string;
    };
}

interface Photo {
    jenis_foto: 'sebelum' | 'selama' | 'sesudah';
    path_foto: string;
    keterangan: string;
}

interface FormData {
    nomor_laporan: string;
    customer_id: string;
    contract_id: string;
    schedule_id: string;
    technician_id: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    jenis_layanan: string;
    jenis_hama: string;
    metode_treatment: string;
    bahan_kimia: string;
    jumlah_bahan: string;
    area_treatment: string;
    peralatan: string;
    temuan: string;
    aktivitas_hama: string;
    tingkat_keparahan: string;
    rekomendasi: string;
    status: 'draft' | 'dikirim';
    catatan_supervisor: string;
    photos: Photo[];
}

const STEPS = [
    { label: 'Pekerjaan', icon: Briefcase },
    { label: 'Inspeksi', icon: SearchIcon },
    { label: 'Treatment', icon: Wrench },
    { label: 'Dokumentasi', icon: Camera },
    { label: 'Review', icon: ClipboardList },
];

const JENIS_LAYANAN_OPTIONS = [
    'General Pest Control',
    'Termite Control',
    'Rodent Control',
    'Fumigation',
    'Disinfection',
    'Insect Control',
];

const JENIS_HAMA_OPTIONS = [
    'Kecoa',
    'Tikus',
    'Semut',
    'Rayap',
    'Nyamuk',
    'Lalat',
    'Kutu',
    'Laba-laba',
    'Lainnya',
];

const METODE_OPTIONS = [
    'Spraying',
    'Fogging',
    'Baiting',
    'Trapping',
    'Soil Treatment',
    'Wood Treatment',
    'Fumigation',
    'Gel Baiting',
];

const TINGKAT_OPTIONS = ['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'];

// FieldRow defined at top module scope so React doesn't unmount input elements on every keystroke
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <Label className="text-body-sm-strong text-ink">{label}</Label>
            {children}
        </div>
    );
}

export default function Create({ customers, technicians, contracts, schedules, nomorLaporan, prefilled }: Props) {
    const [step, setStep] = useState(0);
    const today = new Date().toISOString().split('T')[0];

    // Determine initial values with prefilled support
    const initialScheduleId = prefilled?.schedule_id || '';
    const initialSchedule = schedules.find(s => String(s.id) === String(initialScheduleId));

    const initialCustomerId = prefilled?.customer_id || (initialSchedule ? String(initialSchedule.customer_id) : '');
    const initialTechnicianId = prefilled?.technician_id || (initialSchedule?.technician_id ? String(initialSchedule.technician_id) : (technicians[0]?.id ? String(technicians[0].id) : ''));
    const initialContractId = prefilled?.contract_id || (initialSchedule?.contract_id ? String(initialSchedule.contract_id) : '');
    const initialJenisLayanan = prefilled?.jenis_layanan || (initialSchedule?.jenis_layanan || 'General Pest Control');
    const initialTanggal = prefilled?.tanggal || (initialSchedule?.tanggal || today);
    const initialJamMulai = prefilled?.jam_mulai || (initialSchedule?.jam_mulai ? initialSchedule.jam_mulai.substring(0, 5) : '08:00');
    const initialJamSelesai = prefilled?.jam_selesai || (initialSchedule?.jam_selesai ? initialSchedule.jam_selesai.substring(0, 5) : '');

    const { data, setData, post, processing, errors } = useForm<FormData>({
        nomor_laporan: nomorLaporan,
        customer_id: initialCustomerId,
        contract_id: initialContractId,
        schedule_id: initialScheduleId,
        technician_id: initialTechnicianId,
        tanggal: initialTanggal,
        jam_mulai: initialJamMulai,
        jam_selesai: initialJamSelesai,
        jenis_layanan: initialJenisLayanan,
        jenis_hama: 'Kecoa',
        metode_treatment: 'Spraying',
        bahan_kimia: '',
        jumlah_bahan: '',
        area_treatment: '',
        peralatan: '',
        temuan: '',
        aktivitas_hama: 'Rendah',
        tingkat_keparahan: 'Rendah',
        rekomendasi: '',
        status: 'draft',
        catatan_supervisor: '',
        photos: [],
    });

    const filteredContracts = contracts.filter(c => !data.customer_id || String(c.customer_id) === data.customer_id);
    const filteredSchedules = schedules.filter(s => !data.customer_id || String(s.customer_id) === data.customer_id);

    const handleScheduleChange = (newScheduleId: string) => {
        if (!newScheduleId) {
            setData('schedule_id', '');
            return;
        }

        const sched = schedules.find(s => String(s.id) === newScheduleId);
        if (sched) {
            setData(prev => ({
                ...prev,
                schedule_id: newScheduleId,
                customer_id: String(sched.customer_id),
                contract_id: sched.contract_id ? String(sched.contract_id) : prev.contract_id,
                technician_id: sched.technician_id ? String(sched.technician_id) : prev.technician_id,
                jenis_layanan: sched.jenis_layanan || prev.jenis_layanan,
                tanggal: sched.tanggal || prev.tanggal,
                jam_mulai: sched.jam_mulai ? sched.jam_mulai.substring(0, 5) : prev.jam_mulai,
                jam_selesai: sched.jam_selesai ? sched.jam_selesai.substring(0, 5) : prev.jam_selesai,
            }));
        } else {
            setData('schedule_id', newScheduleId);
        }
    };

    const handleCustomerChange = (newCustomerId: string) => {
        setData(prev => {
            const currentSched = schedules.find(s => String(s.id) === prev.schedule_id);
            const shouldClearSched = currentSched && String(currentSched.customer_id) !== newCustomerId;

            const currentContract = contracts.find(c => String(c.id) === prev.contract_id);
            const shouldClearContract = currentContract && String(currentContract.customer_id) !== newCustomerId;

            return {
                ...prev,
                customer_id: newCustomerId,
                schedule_id: shouldClearSched ? '' : prev.schedule_id,
                contract_id: shouldClearContract ? '' : prev.contract_id,
            };
        });
    };

    const handleFiles = (files: FileList | null, jenis: Photo['jenis_foto']) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArray.length === 0) return;

        let loadedCount = 0;
        const newPhotos: Photo[] = [];

        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                if (base64) {
                    newPhotos.push({ jenis_foto: jenis, path_foto: base64, keterangan: '' });
                }
                loadedCount++;
                if (loadedCount === fileArray.length) {
                    setData('photos', [...data.photos, ...newPhotos]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (idx: number) => {
        setData('photos', data.photos.filter((_, i) => i !== idx));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const submit = (asDraft = false) => {
        setData('status', asDraft ? 'draft' : 'dikirim');
        post(route('work-reports.store'));
    };

    const customerName = customers.find(c => String(c.id) === data.customer_id)?.company_name;

    return (
        <AppLayout>
            <Head title="Buat Laporan Kerja" />

            <div className="max-w-3xl mx-auto space-y-6 pb-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Buat Laporan Kerja</h1>
                        <p className="text-body-sm text-mute mt-1 font-mono">{data.nomor_laporan}</p>
                    </div>
                    <Link href={route('work-reports.index')}>
                        <Button variant="outline" className="text-body-sm-strong">Batal</Button>
                    </Link>
                </div>

                {/* Stepper */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <div className="flex items-center justify-between gap-1">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const done = i < step;
                            const active = i === step;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-slate-900 text-white' : active ? 'bg-slate-900 text-white ring-4 ring-slate-900/20' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                        {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-[10px] font-medium text-center leading-tight hidden sm:block ${active ? 'text-primary' : done ? 'text-ink' : 'text-mute'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-4 w-full bg-canvas-soft-2 rounded-full h-1.5 border border-hairline">
                        <div
                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                    <div className="text-caption text-mute text-center mt-2">Langkah {step + 1} dari {STEPS.length}: <span className="font-medium text-ink">{STEPS[step].label}</span></div>
                </div>

                {/* Step Content */}
                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">

                    {/* Step 1: Informasi Pekerjaan */}
                    {step === 0 && (
                        <div className="space-y-5">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-mute" /> Informasi Pekerjaan
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FieldRow label="Nomor Laporan">
                                    <Input value={data.nomor_laporan} onChange={e => setData('nomor_laporan', e.target.value)} className="font-mono" />
                                    {errors.nomor_laporan && <div className="text-error text-xs mt-1">{errors.nomor_laporan}</div>}
                                </FieldRow>

                                <FieldRow label="Jadwal Terkait (Opsional - Auto Isi)">
                                    <select
                                        value={data.schedule_id}
                                        onChange={e => handleScheduleChange(e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">-- Tidak ada jadwal / Pilih Manual --</option>
                                        {filteredSchedules.map(s => <option key={s.id} value={s.id}>{s.schedule_code} – {s.tanggal} ({s.jenis_layanan})</option>)}
                                    </select>
                                </FieldRow>

                                <FieldRow label="Customer *">
                                    <select
                                        value={data.customer_id}
                                        onChange={e => handleCustomerChange(e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">-- Pilih Customer --</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                    </select>
                                    {errors.customer_id && <div className="text-error text-xs mt-1">{errors.customer_id}</div>}
                                </FieldRow>

                                <FieldRow label="Kontrak (Opsional)">
                                    <select
                                        value={data.contract_id}
                                        onChange={e => setData('contract_id', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">-- Tidak ada kontrak --</option>
                                        {filteredContracts.map(c => <option key={c.id} value={c.id}>{c.contract_number} – {c.contract_type}</option>)}
                                    </select>
                                </FieldRow>

                                <FieldRow label="Teknisi *">
                                    <select
                                        value={data.technician_id}
                                        onChange={e => setData('technician_id', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">-- Pilih Teknisi --</option>
                                        {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    {errors.technician_id && <div className="text-error text-xs mt-1">{errors.technician_id}</div>}
                                </FieldRow>

                                <FieldRow label="Tanggal Pekerjaan *">
                                    <Input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} />
                                    {errors.tanggal && <div className="text-error text-xs mt-1">{errors.tanggal}</div>}
                                </FieldRow>

                                <FieldRow label="Jam Mulai *">
                                    <Input type="time" value={data.jam_mulai} onChange={e => setData('jam_mulai', e.target.value)} />
                                </FieldRow>

                                <FieldRow label="Jam Selesai">
                                    <Input type="time" value={data.jam_selesai} onChange={e => setData('jam_selesai', e.target.value)} />
                                </FieldRow>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Inspeksi */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 flex items-center gap-2">
                                <SearchIcon className="w-4 h-4 text-mute" /> Hasil Inspeksi Lapangan
                            </h2>
                            <FieldRow label="Temuan di Lapangan">
                                <Textarea
                                    value={data.temuan}
                                    onChange={e => setData('temuan', e.target.value)}
                                    placeholder="Deskripsikan temuan yang ditemukan di lokasi (area infestasi, kerusakan, dll)..."
                                    rows={4}
                                />
                            </FieldRow>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FieldRow label="Aktivitas Hama">
                                    <Input value={data.aktivitas_hama} onChange={e => setData('aktivitas_hama', e.target.value)} placeholder="Contoh: Ditemukan jejak tikus di gudang" />
                                </FieldRow>
                                <FieldRow label="Tingkat Keparahan">
                                    <select
                                        value={data.tingkat_keparahan}
                                        onChange={e => setData('tingkat_keparahan', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {TINGKAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </FieldRow>
                            </div>
                            <FieldRow label="Rekomendasi Tindak Lanjut">
                                <Textarea
                                    value={data.rekomendasi}
                                    onChange={e => setData('rekomendasi', e.target.value)}
                                    placeholder="Rekomendasi perbaikan atau tindak lanjut yang diperlukan..."
                                    rows={3}
                                />
                            </FieldRow>
                        </div>
                    )}

                    {/* Step 3: Treatment */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-mute" /> Detail Treatment
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FieldRow label="Jenis Layanan *">
                                    <select
                                        value={data.jenis_layanan}
                                        onChange={e => setData('jenis_layanan', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {JENIS_LAYANAN_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </FieldRow>
                                <FieldRow label="Jenis Hama">
                                    <select
                                        value={data.jenis_hama}
                                        onChange={e => setData('jenis_hama', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {JENIS_HAMA_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </FieldRow>
                                <FieldRow label="Metode Treatment">
                                    <select
                                        value={data.metode_treatment}
                                        onChange={e => setData('metode_treatment', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {METODE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </FieldRow>
                                <FieldRow label="Bahan Kimia / Produk">
                                    <Input value={data.bahan_kimia} onChange={e => setData('bahan_kimia', e.target.value)} placeholder="Nama produk, misal: Cypermethrin 100 EC" />
                                </FieldRow>
                                <FieldRow label="Jumlah Bahan">
                                    <Input value={data.jumlah_bahan} onChange={e => setData('jumlah_bahan', e.target.value)} placeholder="Contoh: 500 ml" />
                                </FieldRow>
                                <FieldRow label="Peralatan yang Digunakan">
                                    <Input value={data.peralatan} onChange={e => setData('peralatan', e.target.value)} placeholder="Sprayer, ULV machine, dll" />
                                </FieldRow>
                            </div>
                            <FieldRow label="Area Treatment *">
                                <Textarea
                                    value={data.area_treatment}
                                    onChange={e => setData('area_treatment', e.target.value)}
                                    placeholder="Deskripsikan area yang di-treatment (lantai, ruangan, perimeter, dll)..."
                                    rows={3}
                                />
                            </FieldRow>
                        </div>
                    )}

                    {/* Step 4: Dokumentasi Foto */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 flex items-center gap-2">
                                <Camera className="w-4 h-4 text-mute" /> Dokumentasi Foto
                            </h2>
                            <p className="text-body-sm text-mute">Tambahkan foto dokumentasi sebelum, selama, dan sesudah treatment menggunakan kamera HP atau ambil dari galeri foto.</p>

                            {(['sebelum', 'selama', 'sesudah'] as const).map(jenis => (
                                <div key={jenis} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-body-sm-strong text-ink capitalize">Foto {jenis.charAt(0).toUpperCase() + jenis.slice(1)} Treatment</h3>
                                        <div className="flex items-center gap-2">
                                            <input
                                                id={`camera-${jenis}`}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                className="hidden"
                                                onChange={e => {
                                                    handleFiles(e.target.files, jenis);
                                                    e.target.value = '';
                                                }}
                                            />
                                            <input
                                                id={`gallery-${jenis}`}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={e => {
                                                    handleFiles(e.target.files, jenis);
                                                    e.target.value = '';
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById(`camera-${jenis}`)?.click()}
                                                className="text-xs flex items-center gap-1.5 hover:border-primary hover:text-primary"
                                            >
                                                <Camera className="w-3.5 h-3.5 text-primary" /> Kamera
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById(`gallery-${jenis}`)?.click()}
                                                className="text-xs flex items-center gap-1.5 hover:border-blue-600 hover:text-blue-600"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Galeri
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {data.photos.filter(p => p.jenis_foto === jenis).map((photo) => {
                                            const idx = data.photos.indexOf(photo);
                                            return (
                                                <div key={idx} className="relative group border border-hairline rounded-md overflow-hidden bg-canvas-soft aspect-square">
                                                    <img src={photo.path_foto} alt={`${jenis}-${idx}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>'; }} />
                                                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1.5 right-1.5 bg-red-600/90 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5">
                                                        <Input
                                                            value={photo.keterangan}
                                                            onChange={e => {
                                                                const updated = [...data.photos];
                                                                updated[idx] = { ...updated[idx], keterangan: e.target.value };
                                                                setData('photos', updated);
                                                            }}
                                                            placeholder="Keterangan foto..."
                                                            className="h-6 text-xs bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 p-0"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {data.photos.filter(p => p.jenis_foto === jenis).length === 0 && (
                                            <div className="border-2 border-dashed border-hairline rounded-md aspect-square flex flex-col items-center justify-center p-3 text-center bg-canvas-soft/40 hover:bg-canvas-soft/70 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-mute">
                                                    <Camera className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-semibold text-ink mb-0.5">Belum ada foto {jenis}</span>
                                                <span className="text-[11px] text-mute mb-2.5">Ambil via kamera atau pilih foto dari galeri HP</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById(`camera-${jenis}`)?.click()}
                                                        className="px-2.5 py-1 text-xs font-medium bg-white border border-hairline rounded shadow-xs hover:bg-slate-50 flex items-center gap-1 text-slate-700 active:scale-95 transition"
                                                    >
                                                        <Camera className="w-3 h-3 text-primary" /> Kamera
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById(`gallery-${jenis}`)?.click()}
                                                        className="px-2.5 py-1 text-xs font-medium bg-white border border-hairline rounded shadow-xs hover:bg-slate-50 flex items-center gap-1 text-slate-700 active:scale-95 transition"
                                                    >
                                                        <ImageIcon className="w-3 h-3 text-blue-600" /> Galeri
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 5: Review & Kirim */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-mute" /> Ringkasan & Pengiriman
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-canvas-soft rounded-md border border-hairline p-4 space-y-3">
                                    <h3 className="text-caption-mono uppercase text-mute font-semibold tracking-wide">Informasi Pekerjaan</h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-body-sm">
                                        <div><span className="text-mute">Nomor:</span> <span className="font-mono font-medium text-ink">{data.nomor_laporan}</span></div>
                                        <div><span className="text-mute">Customer:</span> <span className="font-medium text-ink">{customerName || '–'}</span></div>
                                        <div><span className="text-mute">Tanggal:</span> <span className="text-ink">{data.tanggal}</span></div>
                                        <div><span className="text-mute">Waktu:</span> <span className="text-ink">{data.jam_mulai}{data.jam_selesai ? ` – ${data.jam_selesai}` : ''}</span></div>
                                        <div><span className="text-mute">Teknisi:</span> <span className="text-ink">{technicians.find(t => String(t.id) === data.technician_id)?.name || '–'}</span></div>
                                    </div>
                                </div>
                                <div className="bg-canvas-soft rounded-md border border-hairline p-4 space-y-3">
                                    <h3 className="text-caption-mono uppercase text-mute font-semibold tracking-wide">Inspeksi & Treatment</h3>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-body-sm">
                                        <div><span className="text-mute">Layanan:</span> <span className="text-ink">{data.jenis_layanan}</span></div>
                                        <div><span className="text-mute">Hama:</span> <span className="text-ink">{data.jenis_hama}</span></div>
                                        <div><span className="text-mute">Metode:</span> <span className="text-ink">{data.metode_treatment}</span></div>
                                        <div><span className="text-mute">Keparahan:</span> <span className="text-ink">{data.tingkat_keparahan}</span></div>
                                        <div><span className="text-mute">Bahan:</span> <span className="text-ink">{data.bahan_kimia || '–'} {data.jumlah_bahan}</span></div>
                                    </div>
                                    {data.temuan && <div className="text-body-sm"><span className="text-mute block mb-1">Temuan:</span><p className="text-ink">{data.temuan}</p></div>}
                                    {data.rekomendasi && <div className="text-body-sm"><span className="text-mute block mb-1">Rekomendasi:</span><p className="text-ink">{data.rekomendasi}</p></div>}
                                </div>
                                <div className="bg-canvas-soft rounded-md border border-hairline p-4">
                                    <h3 className="text-caption-mono uppercase text-mute font-semibold tracking-wide mb-3">Foto Dokumentasi</h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {(['sebelum', 'selama', 'sesudah'] as const).map(jenis => {
                                            const count = data.photos.filter(p => p.jenis_foto === jenis).length;
                                            return (
                                                <div key={jenis} className={`flex items-center gap-1.5 text-body-sm px-3 py-1.5 rounded-md border ${count > 0 ? 'bg-[#0070f3]/10 border-[#0070f3]/30 text-[#0070f3]' : 'bg-canvas border-hairline text-mute'}`}>
                                                    <Camera className="w-3.5 h-3.5" />
                                                    <span className="capitalize">{jenis}:</span>
                                                    <span className="font-medium">{count} foto</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-hairline space-y-3">
                                <p className="text-body-sm text-mute">Pilih aksi pengiriman laporan:</p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 text-body-sm-strong"
                                        disabled={processing}
                                        onClick={() => submit(true)}
                                    >
                                        Simpan sebagai Draft
                                    </Button>
                                    <Button
                                        type="button"
                                        className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-semibold"
                                        disabled={processing}
                                        onClick={() => submit(false)}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Kirim untuk Persetujuan
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 0}
                        className="text-body-sm-strong flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" /> Sebelumnya
                    </Button>
                    {step < STEPS.length - 1 && (
                        <Button
                            type="button"
                            className="bg-slate-900 text-white hover:bg-slate-800 font-semibold flex items-center gap-2"
                            onClick={nextStep}
                        >
                            Selanjutnya <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
