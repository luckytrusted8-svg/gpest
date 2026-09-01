import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';
import { 
    Type, Hash, CheckSquare, ChevronDown, ListFilter, Calendar, 
    Image as ImageIcon, Edit3, QrCode, FileText, Package, Phone, Mail, 
    Plus, Trash2, Smartphone, Save, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';

interface FormField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    placeholder?: string;
}

const FIELD_TYPES = [
    { type: 'text', label: 'Text', icon: Type, desc: 'Teks singkat' },
    { type: 'number', label: 'Number', icon: Hash, desc: 'Angka & kuantitas' },
    { type: 'yesno', label: 'Yes/No', icon: CheckSquare, desc: 'Pilihan Ya atau Tidak' },
    { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, desc: 'Pilihan tunggal' },
    { type: 'multiselect', label: 'Multiple Select', icon: ListFilter, desc: 'Bisa pilih banyak' },
    { type: 'date', label: 'Date', icon: Calendar, desc: 'Tanggal & waktu' },
    { type: 'image', label: 'Image', icon: ImageIcon, desc: 'Foto dokumentasi' },
    { type: 'signature', label: 'Signature', icon: Edit3, desc: 'Tanda tangan digital' },
    { type: 'barcode', label: 'Barcode', icon: QrCode, desc: 'Pemindai barcode trap' },
    { type: 'document', label: 'Document', icon: FileText, desc: 'Unggah file PDF/Doc' },
    { type: 'item', label: 'Item', icon: Package, desc: 'Master chemical/perangkap' },
    { type: 'phone', label: 'Phone Number', icon: Phone, desc: 'Nomor telepon' },
    { type: 'email', label: 'Email', icon: Mail, desc: 'Alamat surel' },
];

export default function AppBuilderIndex() {
    const [formTitle, setFormTitle] = useState('Work Report Residential');
    const [serviceType, setServiceType] = useState('General Pest Control');
    const [fields, setFields] = useState<FormField[]>([
        { id: '1', label: 'Jenis Pekerjaan', type: 'dropdown', required: true, options: ['Treatment Routine', 'Supervisi', 'Complaint Call'] },
        { id: '2', label: 'Jenis Hama Yang Ditemukan', type: 'multiselect', required: true, options: ['Kecoa', 'Kutu', 'Lalat', 'Cicak', 'Semut', 'Tikus', 'Tawon', 'Nyamuk', 'Lainnya'] },
        { id: '3', label: 'Quantity Temuan Hama', type: 'number', required: false, placeholder: 'Jumlah hama...' },
        { id: '4', label: 'Lokasi Area Treatment', type: 'multiselect', required: true, options: ['Ruang Tamu', 'Dapur', 'Kamar Utama', 'Gudang', 'Garasi', 'Taman'] },
        { id: '5', label: 'Foto Dokumentasi Before', type: 'image', required: true },
        { id: '6', label: 'Tanda Tangan Customer', type: 'signature', required: true },
    ]);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const addField = (fieldType: string) => {
        const itemType = FIELD_TYPES.find(t => t.type === fieldType);
        const newField: FormField = {
            id: Date.now().toString(),
            label: `Kolom ${itemType?.label || 'Baru'}`,
            type: fieldType,
            required: false,
            options: ['dropdown', 'multiselect'].includes(fieldType) ? ['Opsi 1', 'Opsi 2'] : undefined,
            placeholder: `Input ${itemType?.label.toLowerCase()}...`,
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateFieldLabel = (id: string, newLabel: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, label: newLabel } : f));
    };

    const toggleRequired = (id: string) => {
        setFields(fields.map(f => f.id === id ? { ...f, required: !f.required } : f));
    };

    const handleSaveForm = () => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
    };

    return (
        <AppLayout>
            <Head title="App-Builder (Form Builder)" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Top Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                                Modul Jarivis Deck Slide 8
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">App-Builder (Form Work Report Custom)</h1>
                        <p className="text-sm text-gray-500">
                            Buat dan sesuaikan formulir kerja teknisi lapangan tanpa perlu koding (*No-Code Form Builder*).
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {savedSuccess && (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-4 h-4" /> Form Tersimpan!
                            </span>
                        )}
                        <button
                            onClick={handleSaveForm}
                            className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                        >
                            <Save className="w-4 h-4" /> Simpan Form
                        </button>
                    </div>
                </div>

                {/* 3 Column Grid: Form Config, Canvas Builder, Live Mobile Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Panel 1: Field Type Selector (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600" /> Pilih Format Field
                            </h2>
                            <p className="text-xs text-gray-500 mb-4">Klik format kolom di bawah ini untuk menambahkan ke form Anda:</p>

                            <div className="grid grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
                                {FIELD_TYPES.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.type}
                                            onClick={() => addField(item.type)}
                                            className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
                                        >
                                            <div className="w-7 h-7 rounded-md bg-gray-100 group-hover:bg-blue-600 group-hover:text-white text-gray-600 flex items-center justify-center shrink-0 transition-colors">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-gray-800 truncate group-hover:text-blue-700">{item.label}</div>
                                                <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Benefits Info Box */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-4 shadow-md space-y-2">
                            <h3 className="font-bold text-sm">Manfaat App-Builder</h3>
                            <ul className="text-xs space-y-1.5 opacity-90">
                                <li>• Mengurangi Cost operational & percetakan kertas</li>
                                <li>• Inovasi form fleksibel untuk Pest, Termite, & Fumigasi</li>
                                <li>• Pertumbuhan efisiensi pekerjaan teknisi</li>
                                <li>• Meningkatkan ROI & kecepatan reporting ke klien</li>
                            </ul>
                        </div>
                    </div>

                    {/* Panel 2: Form Canvas / Fields Editor (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Judul Formulir</label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full text-sm font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Kategori Service</label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                    className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="General Pest Control">General Pest Control</option>
                                    <option value="Termite Control">Termite Control</option>
                                    <option value="Fumigasi">Fumigasi</option>
                                    <option value="Disinfeksi">Disinfeksi</option>
                                </select>
                            </div>

                            <div className="border-t border-gray-100 pt-3">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Daftar Field ({fields.length})</h3>
                                    <span className="text-[10px] text-gray-400">Drag/Edit label</span>
                                </div>

                                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                                    {fields.map((field, idx) => {
                                        const typeObj = FIELD_TYPES.find(t => t.type === field.type);
                                        const Icon = typeObj?.icon || Type;
                                        return (
                                            <div key={field.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 relative group hover:border-blue-400">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <span className="text-[10px] font-bold text-gray-400 w-4">{idx + 1}.</span>
                                                        <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                                                            className="text-xs font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded w-full focus:outline-none"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeField(field.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                                                    <span className="capitalize font-mono text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                                                        {typeObj?.label}
                                                    </span>
                                                    <label className="flex items-center gap-1 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={() => toggleRequired(field.id)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                                                        />
                                                        Wajib Isi
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel 3: Live Mobile Screen Preview (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                        <div className="w-full max-w-[340px] bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 relative">
                            {/* Camera Notch */}
                            <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                                <div className="w-3 h-3 bg-slate-800 rounded-full" />
                            </div>

                            {/* Mobile Display Header */}
                            <div className="bg-blue-600 rounded-t-[26px] pt-6 pb-3 px-4 text-white space-y-1">
                                <div className="flex items-center justify-between text-[10px] opacity-80 font-mono">
                                    <span>08:44</span>
                                    <span>LTE 80%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-xs truncate max-w-[200px]">{formTitle}</h3>
                                    <span className="text-[9px] bg-blue-500 px-1.5 py-0.5 rounded uppercase font-bold">{serviceType.slice(0, 7)}</span>
                                </div>
                            </div>

                            {/* Mobile Form Interactive Mockup */}
                            <div className="bg-slate-50 min-h-[460px] max-h-[500px] overflow-y-auto p-3.5 space-y-3 rounded-b-[26px] text-gray-800 text-xs">
                                {fields.map((f) => (
                                    <div key={f.id} className="space-y-1 bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
                                        <label className="block text-[11px] font-bold text-gray-800">
                                            {f.label} {f.required && <span className="text-red-500">*</span>}
                                        </label>

                                        {f.type === 'text' && (
                                            <input type="text" disabled placeholder={f.placeholder} className="w-full text-xs p-1.5 border border-gray-200 rounded bg-gray-50" />
                                        )}
                                        {f.type === 'number' && (
                                            <input type="number" disabled placeholder="0" className="w-full text-xs p-1.5 border border-gray-200 rounded bg-gray-50" />
                                        )}
                                        {f.type === 'yesno' && (
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-1 bg-blue-50 border border-blue-500 text-blue-700 font-bold rounded text-[11px]">Ya</button>
                                                <button className="flex-1 py-1 bg-gray-100 text-gray-600 rounded text-[11px]">Tidak</button>
                                            </div>
                                        )}
                                        {f.type === 'dropdown' && (
                                            <select disabled className="w-full text-xs p-1.5 border border-gray-200 rounded bg-gray-50">
                                                {f.options?.map(o => <option key={o}>{o}</option>)}
                                            </select>
                                        )}
                                        {f.type === 'multiselect' && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {f.options?.map(o => (
                                                    <span key={o} className="px-2 py-0.5 bg-blue-100 text-blue-700 font-medium rounded-full text-[10px]">
                                                        {o}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {f.type === 'date' && (
                                            <input type="date" disabled className="w-full text-xs p-1.5 border border-gray-200 rounded bg-gray-50" />
                                        )}
                                        {f.type === 'image' && (
                                            <div className="h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                                <ImageIcon className="w-5 h-5 mb-1" />
                                                <span className="text-[9px]">Ambil / Unggah Foto</span>
                                            </div>
                                        )}
                                        {f.type === 'signature' && (
                                            <div className="h-14 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 font-serif italic text-xs">
                                                [ Area Tanda Tangan ]
                                            </div>
                                        )}
                                        {f.type === 'barcode' && (
                                            <div className="p-2 border border-gray-300 rounded bg-gray-50 flex items-center justify-center gap-2 text-gray-600 text-[10px]">
                                                <QrCode className="w-4 h-4 text-blue-600" /> Pindai Barcode Trap
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 transition shadow-sm mt-4">
                                    Simpan & Kirim Laporan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
