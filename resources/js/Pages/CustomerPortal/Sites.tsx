import { useState, FormEventHandler } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import CustomerPortalLayout from '@/Layouts/CustomerPortalLayout';
import { Button } from '@/Components/ui/button';
import { 
    MapPin, Plus, Edit2, Trash2, Crosshair, CheckCircle2, 
    Building2, Phone, User, ExternalLink, X, Loader2, Search, AlertCircle 
} from 'lucide-react';

interface Site {
    id: number;
    site_code: string;
    site_name: string;
    address: string;
    pic_name: string | null;
    phone: string | null;
    latitude: string | number | null;
    longitude: string | number | null;
    notes: string | null;
    created_at: string;
}

interface CustomerUser {
    id: number;
    nama: string;
    email: string;
    customer?: {
        id: number;
        customer_id: string;
        company_name: string;
        phone: string;
    };
}

interface Props {
    customerUser: CustomerUser;
    sites: {
        data: Site[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function Sites({ customerUser, sites }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSite, setEditingSite] = useState<Site | null>(null);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsSuccess, setGpsSuccess] = useState(false);
    const [search, setSearch] = useState('');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        site_name: '',
        address: '',
        pic_name: customerUser?.nama || '',
        phone: customerUser?.customer?.phone || '',
        latitude: '',
        longitude: '',
        notes: '',
    });

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingSite(null);
        setData({
            site_name: '',
            address: '',
            pic_name: customerUser?.nama || '',
            phone: customerUser?.customer?.phone || '',
            latitude: '',
            longitude: '',
            notes: '',
        });
        setGpsSuccess(false);
        setIsModalOpen(true);
    };

    const openEditModal = (site: Site) => {
        reset();
        clearErrors();
        setEditingSite(site);
        setData({
            site_name: site.site_name,
            address: site.address,
            pic_name: site.pic_name || '',
            phone: site.phone || '',
            latitude: site.latitude ? site.latitude.toString() : '',
            longitude: site.longitude ? site.longitude.toString() : '',
            notes: site.notes || '',
        });
        setGpsSuccess(!!site.latitude && !!site.longitude);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSite(null);
        reset();
    };

    const handleGetGPS = () => {
        if (!navigator.geolocation) {
            alert('Browser Anda tidak mendukung fitur GPS.');
            return;
        }

        setGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setData((prev) => ({
                    ...prev,
                    latitude: pos.coords.latitude.toString(),
                    longitude: pos.coords.longitude.toString(),
                }));
                setGpsLoading(false);
                setGpsSuccess(true);
            },
            (err) => {
                console.error(err);
                alert('Gagal mendeteksi lokasi. Pastikan izin akses lokasi aktif pada browser.');
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingSite) {
            put(`/portal/sites/${editingSite.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/portal/sites', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (site: Site) => {
        if (confirm(`Hapus titik lokasi "${site.site_name}"? Data yang sudah terkait jadwal/laporan mungkin terpengaruh.`)) {
            destroy(`/portal/sites/${site.id}`);
        }
    };

    const filteredSites = sites.data.filter((s) => 
        s.site_name.toLowerCase().includes(search.toLowerCase()) ||
        s.site_code.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <CustomerPortalLayout customerUser={customerUser}>
            <Head title="Titik Lokasi (Sites) - Portal Pelanggan" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="bg-canvas p-6 rounded-2xl border border-hairline shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="p-2 rounded-xl bg-primary/10 text-primary">
                                <MapPin className="w-5 h-5" />
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold text-ink">Titik Lokasi & Cabang (Sites)</h1>
                        </div>
                        <p className="text-xs sm:text-sm text-mute max-w-2xl">
                            Kelola seluruh titik lokasi atau cabang properti Anda. Data lokasi ini langsung terhubung ke teknisi dan jadwal operasional G-PEST secara realtime.
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="bg-primary hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Titik Lokasi Baru</span>
                    </Button>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-mute absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari lokasi, kode, atau alamat..."
                            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-hairline rounded-xl text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                        />
                    </div>
                    <div className="text-xs text-mute self-end sm:self-auto font-mono">
                        Total {sites.total} Lokasi Terdaftar
                    </div>
                </div>

                {/* Sites Cards Grid */}
                {filteredSites.length === 0 ? (
                    <div className="bg-canvas rounded-2xl border border-hairline p-12 text-center shadow-xs">
                        <div className="w-12 h-12 rounded-2xl bg-canvas-soft-2 flex items-center justify-center mx-auto mb-3 text-mute">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-ink mb-1">Belum Ada Titik Lokasi</h3>
                        <p className="text-xs text-mute max-w-sm mx-auto mb-4">
                            Tambahkan titik lokasi tempat penanganan hama (rumah, kantor, gudang, dsb.) agar jadwal dan teknisi dapat ditugaskan.
                        </p>
                        <Button onClick={openAddModal} className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-xl">
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Tambah Lokasi Pertama
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSites.map((site) => (
                            <div
                                key={site.id}
                                className="bg-canvas border border-hairline rounded-2xl p-5 shadow-xs hover:border-primary/40 hover:shadow-level-1 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                {site.site_code}
                                            </span>
                                            <h3 className="text-base font-bold text-ink mt-1.5 line-clamp-1">
                                                {site.site_name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => openEditModal(site)}
                                                className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft transition-colors cursor-pointer"
                                                title="Edit Titik Lokasi"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(site)}
                                                className="p-1.5 rounded-lg text-mute hover:text-error hover:bg-error-soft transition-colors cursor-pointer"
                                                title="Hapus Titik Lokasi"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="text-xs text-body line-clamp-2">
                                        {site.address}
                                    </div>

                                    {/* PIC & Phone info */}
                                    <div className="pt-2 border-t border-hairline space-y-1.5 text-xs text-mute">
                                        {site.pic_name && (
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-mute shrink-0" />
                                                <span className="truncate">PIC: {site.pic_name}</span>
                                            </div>
                                        )}
                                        {site.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-mute shrink-0" />
                                                <span>{site.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* GPS badge / Map button */}
                                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between">
                                    {site.latitude && site.longitude ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                            <span>GPS Terpasang</span>
                                            <ExternalLink className="w-3 h-3 ml-0.5" />
                                        </a>
                                    ) : (
                                        <span className="text-[11px] text-mute flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-warning" />
                                            Belum ada koordinat GPS
                                        </span>
                                    )}

                                    <button
                                        onClick={() => openEditModal(site)}
                                        className="text-xs text-primary font-medium hover:underline"
                                    >
                                        Edit Data
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Site Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-canvas border border-hairline rounded-2xl max-w-lg w-full p-6 shadow-level-3 space-y-5">
                        <div className="flex items-center justify-between border-b border-hairline pb-3">
                            <h3 className="text-base font-bold text-ink flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {editingSite ? 'Edit Titik Lokasi' : 'Tambah Titik Lokasi Baru'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-mute hover:text-ink p-1 rounded-lg hover:bg-canvas-soft transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1">
                                    Nama Titik Lokasi / Cabang <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    placeholder="Contoh: Kantor Pusat / Gedung Annex / Rumah Utama"
                                    className="w-full px-3 py-2 text-xs bg-canvas-soft border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.site_name && <p className="mt-1 text-xs text-error">{errors.site_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1">
                                    Alamat Lengkap <span className="text-error">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Raya No. ..., Kelurahan, Kecamatan, Kota"
                                    className="w-full px-3 py-2 text-xs bg-canvas-soft border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                                {errors.address && <p className="mt-1 text-xs text-error">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1">
                                        Nama PIC Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.pic_name}
                                        onChange={(e) => setData('pic_name', e.target.value)}
                                        placeholder="Nama Penanggung Jawab"
                                        className="w-full px-3 py-2 text-xs bg-canvas-soft border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-ink mb-1">
                                        No. Telepon PIC
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="081234567890"
                                        className="w-full px-3 py-2 text-xs bg-canvas-soft border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                    />
                                </div>
                            </div>

                            {/* GPS Geolocation helper */}
                            <div className="bg-canvas-soft/80 p-3 rounded-xl border border-hairline space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                                        <Crosshair className="w-3.5 h-3.5 text-primary" />
                                        Titik Koordinat GPS
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleGetGPS}
                                        disabled={gpsLoading}
                                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        {gpsLoading ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Mendeteksi GPS...
                                            </>
                                        ) : gpsSuccess ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 text-success" />
                                                GPS Diperbarui
                                            </>
                                        ) : (
                                            <>Ambil Koordinat Saya (GPS)</>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="Latitude (cth: -6.2088)"
                                        className="w-full px-2.5 py-1.5 text-xs bg-canvas border border-hairline rounded-lg font-mono outline-hidden"
                                    />
                                    <input
                                        type="text"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="Longitude (cth: 106.8456)"
                                        className="w-full px-2.5 py-1.5 text-xs bg-canvas border border-hairline rounded-lg font-mono outline-hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-ink mb-1">
                                    Catatan Khusus Lokasi (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Masuk lewat pintu timur, parkir di basement"
                                    className="w-full px-3 py-2 text-xs bg-canvas-soft border border-hairline rounded-lg text-ink focus:border-primary outline-hidden"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                    className="text-xs"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4"
                                >
                                    {processing ? 'Menyimpan...' : editingSite ? 'Simpan Perubahan' : 'Tambah Titik Lokasi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CustomerPortalLayout>
    );
}
