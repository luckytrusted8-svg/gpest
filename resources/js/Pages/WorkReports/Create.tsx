import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Briefcase, Search as SearchIcon, Wrench, Camera, ClipboardList, Plus, X } from 'lucide-react';

interface Customer { id: number; customer_id: string; company_name: string; }
interface Technician { id: number; name: string; }
interface Contract { id: number; contract_number: string; customer_id: number; contract_type: string; }
interface Schedule { id: number; schedule_code: string; customer_id: number; tanggal: string; jenis_layanan: string; }

interface Props {
    customers: Customer[];
    technicians: Technician[];
    contracts: Contract[];
    schedules: Schedule[];
    nomorLaporan: string;
}

interface Photo { jenis_foto: 'sebelum' | 'selama' | 'sesudah'; path_foto: string; keterangan: string; }

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
    { label: 'Inspeksi',  icon: SearchIcon },
    { label: 'Treatment', icon: Wrench },
    { label: 'Dokumentasi', icon: Camera },
    { label: 'Review', icon: ClipboardList },
];

const JENIS_LAYANAN_OPTIONS = ['General Pest Control', 'Termite Control', 'Rodent Control', 'Fumigation', 'Disinfection', 'Insect Control'];
const JENIS_HAMA_OPTIONS = ['Kecoa', 'Tikus', 'Semut', 'Rayap', 'Nyamuk', 'Lalat', 'Kutu', 'Laba-laba', 'Lainnya'];
const METODE_OPTIONS = ['Spraying', 'Fogging', 'Baiting', 'Trapping', 'Soil Treatment', 'Wood Treatment', 'Fumigation', 'Gel Baiting'];
const TINGKAT_OPTIONS = ['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi'];

export default function Create({ customers, technicians, contracts, schedules, nomorLaporan }: Props) {
    const [step, setStep] = useState(0);
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm<FormData>({
        nomor_laporan: nomorLaporan,
        customer_id: '',
        contract_id: '',
        schedule_id: '',
        technician_id: technicians[0]?.id ? String(technicians[0].id) : '',
        tanggal: today,
        jam_mulai: '08:00',
        jam_selesai: '',
        jenis_layanan: 'General Pest Control',
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

    const addPhoto = (jenis: Photo['jenis_foto']) => {
        const url = prompt(`URL foto ${jenis}:`);
        if (url?.trim()) {
            setData('photos', [...data.photos, { jenis_foto: jenis, path_foto: url.trim(), keterangan: '' }]);
        }
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

    const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-1">
            <Label className="text-body-sm-strong text-ink">{label}</Label>
            {children}
        </div>
    );

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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-primary text-on-primary' : active ? 'bg-primary text-on-primary ring-4 ring-primary/20' : 'bg-canvas-soft-2 text-mute border border-hairline'}`}>
                                        {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-[10px] font-medium text-center leading-tight hidden sm:block ${active ? 'text-primary' : done ? 'text-ink' : 'text-mute'}`}>{s.label}</span>
                                    {i < STEPS.length - 1 && (
                                        <div className="absolute" />
                                    )}
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

                                <FieldRow label="Customer *">
                                    <select
                                        value={data.customer_id}
                                        onChange={e => { setData('customer_id', e.target.value); setData('contract_id', ''); setData('schedule_id', ''); }}
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

                                <FieldRow label="Jadwal Terkait (Opsional)">
                                    <select
                                        value={data.schedule_id}
                                        onChange={e => setData('schedule_id', e.target.value)}
                                        className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">-- Tidak ada jadwal --</option>
                                        {filteredSchedules.map(s => <option key={s.id} value={s.id}>{s.schedule_code} – {s.tanggal} ({s.jenis_layanan})</option>)}
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
                            <p className="text-body-sm text-mute">Tambahkan foto dokumentasi sebelum, selama, dan sesudah treatment sebagai bukti pekerjaan.</p>

                            {(['sebelum', 'selama', 'sesudah'] as const).map(jenis => (
                                <div key={jenis} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-body-sm-strong text-ink capitalize">Foto {jenis.charAt(0).toUpperCase() + jenis.slice(1)} Treatment</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addPhoto(jenis)} className="text-xs flex items-center gap-1">
                                            <Plus className="w-3.5 h-3.5" /> Tambah Foto
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {data.photos.filter(p => p.jenis_foto === jenis).map((photo, globalIdx) => {
                                            const idx = data.photos.indexOf(photo);
                                            return (
                                                <div key={idx} className="relative group border border-hairline rounded-md overflow-hidden bg-canvas-soft aspect-square">
                                                    <img src={photo.path_foto} alt={`${jenis}-${idx}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/><text fill="%23999" x="50" y="55" text-anchor="middle" font-size="12">No Image</text></svg>'; }} />
                                                    <button type="button" onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
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
                                            <div className="border-2 border-dashed border-hairline rounded-md aspect-square flex flex-col items-center justify-center text-mute cursor-pointer hover:border-primary hover:text-primary transition-colors" onClick={() => addPhoto(jenis)}>
                                                <Camera className="w-6 h-6 mb-2 opacity-50" />
                                                <span className="text-xs text-center">Belum ada foto<br />{jenis}</span>
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
                                        className="flex-1 bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
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
                            className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2"
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
