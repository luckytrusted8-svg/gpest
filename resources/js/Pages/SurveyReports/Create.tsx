import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Upload, Camera } from 'lucide-react';

interface Customer { id: number; customer_id: string; company_name: string; }
interface Technician { id: number; name: string; }
interface Contract { id: number; contract_number: string; contract_type: string; }

interface Props {
    customers: Customer[];
    technicians: Technician[];
    nomorSurvey: string;
}

const JENIS_HAMA_OPTIONS = ['Kecoa', 'Tikus', 'Rayap', 'Nyamuk', 'Lalat', 'Semut', 'Kutu Busuk', 'Tawon', 'Laba-laba', 'Lainnya'];

export default function Create({ customers, technicians, nomorSurvey }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const { data, setData, post, processing, errors } = useForm({
        nomor_survey: nomorSurvey,
        customer_id: '',
        contract_id: '',
        technician_id: '',
        tanggal_survey: '',
        lokasi: '',
        jenis_hama: [] as string[],
        area_survey: '',
        temuan: '',
        tingkat_risiko: 'rendah',
        rekomendasi: '',
        catatan: '',
        status: 'draft' as 'draft' | 'dikirim',
        photos: [] as { path_foto: string; keterangan: string }[],
    });

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);

    useEffect(() => {
        if (data.customer_id) {
            fetch(`/contracts?customer_id=${data.customer_id}`, { headers: { Accept: 'application/json' } })
                .then((res) => res.json())
                .then((json) => setContracts(json.contracts ?? json ?? []))
                .catch(() => setContracts([]));
        } else {
            setContracts([]);
        }
    }, [data.customer_id]);

    const toggleHama = (hama: string) => {
        const current = data.jenis_hama;
        setData('jenis_hama', current.includes(hama) ? current.filter((h) => h !== hama) : [...current, hama]);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhotoPreview((prev) => [...prev, ev.target?.result as string]);
                setData('photos', [...data.photos, { path_foto: file.name, keterangan: '' }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (idx: number) => {
        setPhotoPreview((prev) => prev.filter((_, i) => i !== idx));
        setData('photos', data.photos.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/survey-reports');
    };

    return (
        <AppLayout>
            <Head title="Buat Laporan Survey" />
            <div className="max-w-4xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Buat Laporan Survey Baru</h1>
                    <p className="text-body-sm text-mute mt-1">Isi data inspeksi dan temuan di lapangan.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Informasi Umum</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Nomor Survey</Label><Input value={data.nomor_survey} onChange={(e) => setData('nomor_survey', e.target.value)} required /><span className="text-xs text-[#ee0000]">{errors.nomor_survey}</span></div>
                            <div className="space-y-2"><Label>Tanggal Survey</Label><Input type="date" value={data.tanggal_survey} onChange={(e) => setData('tanggal_survey', e.target.value)} required /><span className="text-xs text-[#ee0000]">{errors.tanggal_survey}</span></div>
                            <div className="space-y-2"><Label>Customer</Label>
                                <select value={data.customer_id} onChange={(e) => { setData('customer_id', e.target.value); setData('contract_id', ''); }} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="">Pilih Customer</option>
                                    {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                </select><span className="text-xs text-[#ee0000]">{errors.customer_id}</span>
                            </div>
                            <div className="space-y-2"><Label>Kontrak (Opsional)</Label>
                                <select value={data.contract_id} onChange={(e) => setData('contract_id', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Tanpa Kontrak</option>
                                    {contracts.map((c) => <option key={c.id} value={c.id}>{c.contract_number}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2"><Label>Teknisi</Label>
                                <select value={data.technician_id} onChange={(e) => setData('technician_id', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="">Pilih Teknisi</option>
                                    {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select><span className="text-xs text-[#ee0000]">{errors.technician_id}</span>
                            </div>
                            <div className="space-y-2"><Label>Lokasi</Label><Input value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} placeholder="Alamat lokasi" required /><span className="text-xs text-[#ee0000]">{errors.lokasi}</span></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Area Survey</Label><Input value={data.area_survey} onChange={(e) => setData('area_survey', e.target.value)} placeholder="Contoh: Lantai 1, Gudang, Dapur" required /><span className="text-xs text-[#ee0000]">{errors.area_survey}</span></div>
                        </div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Jenis Hama</h2>
                        <div className="flex flex-wrap gap-2">
                            {JENIS_HAMA_OPTIONS.map((hama) => (
                                <button key={hama} type="button" onClick={() => toggleHama(hama)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${data.jenis_hama.includes(hama) ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                                    {hama}
                                </button>
                            ))}
                        </div>
                        {data.jenis_hama.length === 0 && <p className="text-xs text-[#ee0000]">Pilih minimal satu jenis hama.</p>}
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Temuan & Rekomendasi</h2>
                        <div className="space-y-2"><Label>Temuan Detail</Label><textarea value={data.temuan} onChange={(e) => setData('temuan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-y" placeholder="Jelaskan temuan inspeksi..." required /><span className="text-xs text-[#ee0000]">{errors.temuan}</span></div>
                        <div className="space-y-2"><Label>Tingkat Risiko</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {[{ v: 'rendah', l: 'Rendah', c: 'bg-[#0070f3]/15 text-[#0070f3] border-[#0070f3]/30' }, { v: 'sedang', l: 'Sedang', c: 'bg-[#f5a623]/15 text-[#ab570a] border-[#f5a623]/30' }, { v: 'tinggi', l: 'Tinggi', c: 'bg-[#f97316]/15 text-[#c2410c] border-[#f97316]/30' }, { v: 'kritis', l: 'Kritis', c: 'bg-[#ee0000]/15 text-[#ee0000] border-[#ee0000]/30' }].map((r) => (
                                    <button key={r.v} type="button" onClick={() => setData('tingkat_risiko', r.v as typeof data.tingkat_risiko)} className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${data.tingkat_risiko === r.v ? r.c + ' ring-2 ring-offset-1' : 'bg-canvas text-body-text border-hairline hover:bg-canvas-soft'}`}>{r.l}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Rekomendasi</Label><textarea value={data.rekomendasi} onChange={(e) => setData('rekomendasi', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y" placeholder="Rekomendasi treatment..." required /><span className="text-xs text-[#ee0000]">{errors.rekomendasi}</span></div>
                        <div className="space-y-2"><Label>Catatan (Opsional)</Label><textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" placeholder="Catatan tambahan..." /></div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Dokumentasi Foto</h2>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-hairline rounded-lg cursor-pointer hover:bg-canvas-soft transition-colors">
                            <Upload className="w-6 h-6 text-mute mb-2" />
                            <span className="text-body-sm text-mute">Klik untuk upload foto</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                        {photoPreview.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {photoPreview.map((src, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={src} alt={`Foto ${idx + 1}`} className="w-full h-24 object-cover rounded-md border border-hairline" />
                                        <button type="button" onClick={() => removePhoto(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#ee0000] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/survey-reports"><Button type="button" variant="outline" className="text-body-sm-strong">Batal</Button></Link>
                        <Button type="button" variant="outline" className="text-body-sm-strong" disabled={processing} onClick={() => { setData('status', 'draft'); post('/survey-reports'); }}>Simpan Draft</Button>
                        <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 font-semibold" disabled={processing} onClick={() => setData('status', 'dikirim')}>{processing ? 'Menyimpan...' : 'Kirim Laporan'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
