import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Upload } from 'lucide-react';

interface Customer { id: number; customer_id: string; company_name: string; }
interface Technician { id: number; name: string; }
interface Contract { id: number; contract_number: string; contract_type: string; }
interface Photo { id: number; path_foto: string; keterangan: string | null; }

interface SurveyReportData {
    id: number;
    nomor_survey: string;
    customer_id: number;
    contract_id: number | null;
    technician_id: number;
    tanggal_survey: string;
    lokasi: string;
    jenis_hama: string[];
    area_survey: string;
    temuan: string;
    tingkat_risiko: string;
    rekomendasi: string;
    catatan: string | null;
    status: string;
    photos: Photo[];
}

interface Props {
    surveyReport: SurveyReportData;
    customers: Customer[];
    technicians: Technician[];
    contracts: Contract[];
}

const JENIS_HAMA_OPTIONS = ['Kecoa', 'Tikus', 'Rayap', 'Nyamuk', 'Lalat', 'Semut', 'Kutu Busuk', 'Tawon', 'Laba-laba', 'Lainnya'];

export default function Edit({ surveyReport, customers, technicians, contracts }: Props) {
    const { flash } = usePage().props as Record<string, unknown>;
    const f = flash as { success?: string; error?: string } | undefined;

    const { data, setData, put, processing, errors } = useForm({
        nomor_survey: surveyReport.nomor_survey,
        customer_id: String(surveyReport.customer_id),
        contract_id: surveyReport.contract_id ? String(surveyReport.contract_id) : '',
        technician_id: String(surveyReport.technician_id),
        tanggal_survey: surveyReport.tanggal_survey,
        lokasi: surveyReport.lokasi,
        jenis_hama: surveyReport.jenis_hama ?? [],
        area_survey: surveyReport.area_survey,
        temuan: surveyReport.temuan,
        tingkat_risiko: surveyReport.tingkat_risiko,
        rekomendasi: surveyReport.rekomendasi,
        catatan: surveyReport.catatan ?? '',
        status: 'draft' as 'draft' | 'dikirim',
        photos: [] as { path_foto: string; keterangan: string }[],
    });

    const [allContracts, setAllContracts] = useState<Contract[]>(contracts);
    const [photoPreview, setPhotoPreview] = useState<string[]>(surveyReport.photos.map((p) => p.path_foto));
    const [existingPhotos, setExistingPhotos] = useState<Photo[]>(surveyReport.photos);

    useEffect(() => {
        if (data.customer_id) {
            fetch(`/contracts?customer_id=${data.customer_id}`, { headers: { Accept: 'application/json' } })
                .then((res) => res.json())
                .then((json) => setAllContracts(json.contracts ?? json ?? []))
                .catch(() => setAllContracts([]));
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

    const removeExistingPhoto = (id: number) => {
        setExistingPhotos((prev) => prev.filter((p) => p.id !== id));
    };

    const removeNewPhoto = (idx: number) => {
        const newIdx = idx - existingPhotos.length;
        if (newIdx >= 0) {
            setPhotoPreview((prev) => prev.filter((_, i) => i !== idx));
            setData('photos', data.photos.filter((_, i) => i !== newIdx));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/survey-reports/${surveyReport.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Survey ${surveyReport.nomor_survey}`} />
            <div className="max-w-4xl mx-auto space-y-6">
                {f?.success && <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{f.success}</div>}
                {f?.error && <div className="bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-4 py-3 rounded-md text-body-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{f.error}</div>}

                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Edit {surveyReport.nomor_survey}</h1>
                    <p className="text-body-sm text-mute mt-1">Perbarui data laporan survey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Informasi Umum</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Nomor Survey</Label><Input value={data.nomor_survey} onChange={(e) => setData('nomor_survey', e.target.value)} required /><span className="text-xs text-[#ee0000]">{errors.nomor_survey}</span></div>
                            <div className="space-y-2"><Label>Tanggal Survey</Label><Input type="date" value={data.tanggal_survey} onChange={(e) => setData('tanggal_survey', e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Customer</Label>
                                <select value={data.customer_id} onChange={(e) => { setData('customer_id', e.target.value); setData('contract_id', ''); }} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="">Pilih Customer</option>
                                    {customers.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2"><Label>Kontrak</Label>
                                <select value={data.contract_id} onChange={(e) => setData('contract_id', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary">
                                    <option value="">Tanpa Kontrak</option>
                                    {allContracts.map((c) => <option key={c.id} value={c.id}>{c.contract_number}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2"><Label>Teknisi</Label>
                                <select value={data.technician_id} onChange={(e) => setData('technician_id', e.target.value)} className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary" required>
                                    <option value="">Pilih Teknisi</option>
                                    {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2"><Label>Lokasi</Label><Input value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} required /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Area Survey</Label><Input value={data.area_survey} onChange={(e) => setData('area_survey', e.target.value)} required /></div>
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
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Temuan & Rekomendasi</h2>
                        <div className="space-y-2"><Label>Temuan</Label><textarea value={data.temuan} onChange={(e) => setData('temuan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] resize-y" required /></div>
                        <div className="space-y-2"><Label>Tingkat Risiko</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {[{ v: 'rendah', l: 'Rendah', c: 'bg-[#0070f3]/15 text-[#0070f3] border-[#0070f3]/30' }, { v: 'sedang', l: 'Sedang', c: 'bg-[#f5a623]/15 text-[#ab570a] border-[#f5a623]/30' }, { v: 'tinggi', l: 'Tinggi', c: 'bg-[#f97316]/15 text-[#c2410c] border-[#f97316]/30' }, { v: 'kritis', l: 'Kritis', c: 'bg-[#ee0000]/15 text-[#ee0000] border-[#ee0000]/30' }].map((r) => (
                                    <button key={r.v} type="button" onClick={() => setData('tingkat_risiko', r.v)} className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${data.tingkat_risiko === r.v ? r.c + ' ring-2 ring-offset-1' : 'bg-canvas text-body-text border-hairline'}`}>{r.l}</button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2"><Label>Rekomendasi</Label><textarea value={data.rekomendasi} onChange={(e) => setData('rekomendasi', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y" required /></div>
                        <div className="space-y-2"><Label>Catatan</Label><textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y" /></div>
                    </div>

                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6 space-y-4">
                        <h2 className="text-body-md-strong text-ink border-b border-hairline pb-3">Foto</h2>
                        {existingPhotos.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                {existingPhotos.map((photo) => (
                                    <div key={photo.id} className="relative group">
                                        <img src={photo.path_foto} alt="" className="w-full h-24 object-cover rounded-md border border-hairline" />
                                        <button type="button" onClick={() => removeExistingPhoto(photo.id)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#ee0000] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-hairline rounded-lg cursor-pointer hover:bg-canvas-soft transition-colors">
                            <Upload className="w-5 h-5 text-mute mb-1" /><span className="text-xs text-mute">Tambah foto</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                        {photoPreview.length > existingPhotos.length && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {photoPreview.slice(existingPhotos.length).map((src, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={src} alt="" className="w-full h-24 object-cover rounded-md border border-hairline" />
                                        <button type="button" onClick={() => removeNewPhoto(idx + existingPhotos.length)} className="absolute -top-2 -right-2 w-5 h-5 bg-[#ee0000] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href={`/survey-reports/${surveyReport.id}`}><Button type="button" variant="outline" className="text-body-sm-strong">Batal</Button></Link>
                        <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 font-semibold" disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
