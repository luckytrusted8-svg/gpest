import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft, X, Camera, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';

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

interface Photo {
    id?: number;
    jenis_foto: 'sebelum' | 'selama' | 'sesudah';
    path_foto: string;
    keterangan: string;
}

interface WorkReport {
    id: number;
    nomor_laporan: string;
    customer_id: number;
    contract_id: number | null;
    schedule_id: number | null;
    technician_id: number;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string | null;
    jenis_layanan: string;
    jenis_hama: string | null;
    metode_treatment: string | null;
    bahan_kimia: string | null;
    jumlah_bahan: string | null;
    area_treatment: string | null;
    peralatan: string | null;
    temuan: string | null;
    aktivitas_hama: string | null;
    tingkat_keparahan: string | null;
    rekomendasi: string | null;
    status: 'draft' | 'dikirim' | 'disetujui' | 'revisi' | 'selesai';
    catatan_supervisor: string | null;
    photos: Photo[];
}

interface Props {
    workReport: WorkReport;
    customers: Customer[];
    technicians: Technician[];
    contracts: Contract[];
    schedules: Schedule[];
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
function FieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <Label className="text-body-sm-strong text-ink">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </Label>
            {children}
        </div>
    );
}

export default function Edit({ workReport, customers, technicians, contracts, schedules }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        nomor_laporan: workReport.nomor_laporan,
        customer_id: String(workReport.customer_id),
        contract_id: workReport.contract_id ? String(workReport.contract_id) : '',
        schedule_id: workReport.schedule_id ? String(workReport.schedule_id) : '',
        technician_id: String(workReport.technician_id),
        tanggal: workReport.tanggal,
        jam_mulai: workReport.jam_mulai,
        jam_selesai: workReport.jam_selesai || '',
        jenis_layanan: workReport.jenis_layanan,
        jenis_hama: workReport.jenis_hama || '',
        metode_treatment: workReport.metode_treatment || '',
        bahan_kimia: workReport.bahan_kimia || '',
        jumlah_bahan: workReport.jumlah_bahan || '',
        area_treatment: workReport.area_treatment || '',
        peralatan: workReport.peralatan || '',
        temuan: workReport.temuan || '',
        aktivitas_hama: workReport.aktivitas_hama || '',
        tingkat_keparahan: workReport.tingkat_keparahan || 'Rendah',
        rekomendasi: workReport.rekomendasi || '',
        status: workReport.status === 'revisi' ? 'dikirim' : (workReport.status as 'draft' | 'dikirim'),
        catatan_supervisor: workReport.catatan_supervisor || '',
        photos: workReport.photos.map(p => ({ ...p, keterangan: p.keterangan || '' })),
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('work-reports.update', workReport.id));
    };

    const submitWithStatus = (targetStatus: 'draft' | 'dikirim') => {
        setData('status', targetStatus);
        data.status = targetStatus;
        put(route('work-reports.update', workReport.id));
    };

    return (
        <AppLayout>
            <Head title={`Edit Laporan: ${workReport.nomor_laporan}`} />

            <div className="max-w-4xl mx-auto space-y-6 pb-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href={route('work-reports.show', workReport.id)}>
                            <Button variant="outline" size="icon" className="h-9 w-9"><ArrowLeft className="w-4 h-4" /></Button>
                        </Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">Edit Laporan Kerja</h1>
                            <p className="text-body-sm text-mute mt-0.5 font-mono">{workReport.nomor_laporan}</p>
                        </div>
                    </div>
                    <Link href={route('work-reports.show', workReport.id)}>
                        <Button variant="outline" className="text-body-sm-strong">Batal</Button>
                    </Link>
                </div>

                {/* Notice Revisi jika status laporan adalah revisi */}
                {workReport.status === 'revisi' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 space-y-2">
                        <div className="flex items-center gap-2 text-amber-800 font-semibold text-body-sm">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Perbaikan Laporan (Instruksi Revisi dari Admin)</span>
                        </div>
                        {workReport.catatan_supervisor && (
                            <div className="p-3 bg-white/80 border border-amber-200 rounded text-body-sm text-ink italic">
                                "{workReport.catatan_supervisor}"
                            </div>
                        )}
                        <p className="text-xs text-amber-700">
                            Silakan perbaiki bagian yang diminta oleh Admin di bawah, lalu klik tombol <strong>"Kirim Ulang Hasil Revisi ke Admin"</strong> di bagian bawah halaman.
                        </p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Informasi Pekerjaan */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3">Informasi Pekerjaan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FieldRow label="Nomor Laporan" required>
                                <Input value={data.nomor_laporan} onChange={e => setData('nomor_laporan', e.target.value)} className="font-mono" />
                                {errors.nomor_laporan && <div className="text-error text-xs mt-1">{errors.nomor_laporan}</div>}
                            </FieldRow>

                            <FieldRow label="Jadwal Terkait (Opsional - Auto Isi)">
                                <select
                                    value={data.schedule_id}
                                    onChange={e => handleScheduleChange(e.target.value)}
                                    className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">-- Tidak ada / Pilih Manual --</option>
                                    {filteredSchedules.map(s => <option key={s.id} value={s.id}>{s.schedule_code} – {s.tanggal} ({s.jenis_layanan})</option>)}
                                </select>
                            </FieldRow>

                            <FieldRow label="Customer" required>
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

                            <FieldRow label="Kontrak">
                                <select
                                    value={data.contract_id}
                                    onChange={e => setData('contract_id', e.target.value)}
                                    className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">-- Tidak ada --</option>
                                    {filteredContracts.map(c => <option key={c.id} value={c.id}>{c.contract_number} – {c.contract_type}</option>)}
                                </select>
                            </FieldRow>

                            <FieldRow label="Teknisi" required>
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

                            <FieldRow label="Tanggal" required>
                                <Input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} />
                            </FieldRow>

                            <FieldRow label="Jam Mulai" required>
                                <Input type="time" value={data.jam_mulai} onChange={e => setData('jam_mulai', e.target.value)} />
                            </FieldRow>

                            <FieldRow label="Jam Selesai">
                                <Input type="time" value={data.jam_selesai} onChange={e => setData('jam_selesai', e.target.value)} />
                            </FieldRow>

                            <FieldRow label="Status Pengiriman">
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as 'draft' | 'dikirim')}
                                    className="h-9 w-full px-3 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                                >
                                    <option value="dikirim">{workReport.status === 'revisi' ? 'Kirim Ulang ke Admin (Untuk Persetujuan)' : 'Kirim untuk Persetujuan'}</option>
                                    <option value="draft">Simpan sebagai Draft</option>
                                </select>
                            </FieldRow>
                        </div>
                    </div>

                    {/* Inspeksi */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3">Hasil Inspeksi</h2>
                        <FieldRow label="Temuan di Lapangan">
                            <Textarea value={data.temuan} onChange={e => setData('temuan', e.target.value)} placeholder="Deskripsikan temuan di lokasi..." rows={3} />
                        </FieldRow>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FieldRow label="Aktivitas Hama">
                                <Input value={data.aktivitas_hama} onChange={e => setData('aktivitas_hama', e.target.value)} />
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
                            <Textarea value={data.rekomendasi} onChange={e => setData('rekomendasi', e.target.value)} rows={3} />
                        </FieldRow>
                    </div>

                    {/* Treatment */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3">Detail Treatment</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FieldRow label="Jenis Layanan" required>
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
                                <Input value={data.bahan_kimia} onChange={e => setData('bahan_kimia', e.target.value)} />
                            </FieldRow>
                            <FieldRow label="Jumlah Bahan">
                                <Input value={data.jumlah_bahan} onChange={e => setData('jumlah_bahan', e.target.value)} placeholder="500 ml / 2 kg" />
                            </FieldRow>
                            <FieldRow label="Peralatan">
                                <Input value={data.peralatan} onChange={e => setData('peralatan', e.target.value)} />
                            </FieldRow>
                        </div>
                        <FieldRow label="Area Treatment">
                            <Textarea value={data.area_treatment} onChange={e => setData('area_treatment', e.target.value)} rows={2} />
                        </FieldRow>
                    </div>

                    {/* Foto */}
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-5">
                        <h2 className="text-body-sm-strong text-ink uppercase tracking-wide border-b border-hairline pb-3 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-mute" /> Dokumentasi Foto
                        </h2>
                        {(['sebelum', 'selama', 'sesudah'] as const).map(jenis => (
                            <div key={jenis} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-body-sm-strong text-ink capitalize">Foto {jenis.charAt(0).toUpperCase() + jenis.slice(1)}</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            id={`edit-camera-${jenis}`}
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
                                            id={`edit-gallery-${jenis}`}
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
                                            onClick={() => document.getElementById(`edit-camera-${jenis}`)?.click()}
                                            className="text-xs flex items-center gap-1.5 hover:border-primary hover:text-primary"
                                        >
                                            <Camera className="w-3.5 h-3.5" /> Kamera
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById(`edit-gallery-${jenis}`)?.click()}
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
                                                <img src={photo.path_foto} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f5f5f5" width="100" height="100"/></svg>'; }} />
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
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1.5 text-mute">
                                                <Camera className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-semibold text-ink mb-0.5">Belum ada foto</span>
                                            <div className="flex gap-1.5 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById(`edit-camera-${jenis}`)?.click()}
                                                    className="px-2 py-1 text-[11px] font-medium bg-white border border-hairline rounded shadow-xs hover:bg-slate-50 flex items-center gap-1 text-slate-700"
                                                >
                                                    <Camera className="w-3 h-3 text-primary" /> Kamera
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById(`edit-gallery-${jenis}`)?.click()}
                                                    className="px-2 py-1 text-[11px] font-medium bg-white border border-hairline rounded shadow-xs hover:bg-slate-50 flex items-center gap-1 text-slate-700"
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

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-hairline">
                        <Link href={route('work-reports.show', workReport.id)}>
                            <Button type="button" variant="outline" className="w-full sm:w-auto text-body-sm-strong">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={() => submitWithStatus('draft')}
                            className="w-full sm:w-auto text-body-sm-strong"
                        >
                            Simpan sebagai Draft
                        </Button>
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={() => submitWithStatus('dikirim')}
                            className="w-full sm:w-auto bg-primary text-on-primary hover:bg-ink text-body-sm-strong font-semibold flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {workReport.status === 'revisi' ? 'Kirim Ulang Hasil Revisi ke Admin' : 'Simpan & Kirim Laporan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
