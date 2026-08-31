import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface MasterDataItem {
    id: number;
    nama: string;
    deskripsi: string | null;
    status: 'aktif' | 'tidak_aktif';
    satuan?: string;
}

interface Props {
    jenisLayanan: MasterDataItem[];
    jenisHama: MasterDataItem[];
    metodeTreatment: MasterDataItem[];
    bahanKimia: MasterDataItem[];
    jenisKontrak: MasterDataItem[];
    jenisLokasi: MasterDataItem[];
}

const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'aktif') {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0070f3]/15 text-[#0070f3]">
                Aktif
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee0000]/15 text-[#ee0000]">
            Tidak Aktif
        </span>
    );
};

const tabConfig = [
    { value: 'jenis-layanan', label: 'Jenis Layanan', dataKey: 'jenisLayanan' },
    { value: 'jenis-hama', label: 'Jenis Hama', dataKey: 'jenisHama' },
    { value: 'metode-treatment', label: 'Metode Treatment', dataKey: 'metodeTreatment' },
    { value: 'bahan-kimia', label: 'Bahan Kimia', dataKey: 'bahanKimia' },
    { value: 'jenis-kontrak', label: 'Jenis Kontrak', dataKey: 'jenisKontrak' },
    { value: 'jenis-lokasi', label: 'Jenis Lokasi', dataKey: 'jenisLokasi' },
] as const;

export default function MasterDataIndex({
    jenisLayanan,
    jenisHama,
    metodeTreatment,
    bahanKimia,
    jenisKontrak,
    jenisLokasi,
}: Props) {
    const dataMap: Record<string, MasterDataItem[]> = {
        'jenis-layanan': jenisLayanan,
        'jenis-hama': jenisHama,
        'metode-treatment': metodeTreatment,
        'bahan-kimia': bahanKimia,
        'jenis-kontrak': jenisKontrak,
        'jenis-lokasi': jenisLokasi,
    };

    const [activeTab, setActiveTab] = useState('jenis-layanan');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);
    const [form, setForm] = useState({ nama: '', deskripsi: '', status: 'aktif', satuan: '' });
    const [processing, setProcessing] = useState(false);

    const currentData = dataMap[activeTab] || [];
    const isBahanKimia = activeTab === 'bahan-kimia';

    const openCreate = useCallback(() => {
        setEditingItem(null);
        setForm({ nama: '', deskripsi: '', status: 'aktif', satuan: '' });
        setShowModal(true);
    }, []);

    const openEdit = useCallback((item: MasterDataItem) => {
        setEditingItem(item);
        setForm({
            nama: item.nama,
            deskripsi: item.deskripsi || '',
            status: item.status,
            satuan: item.satuan || '',
        });
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingItem(null);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();
        };
        if (showModal) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [showModal, closeModal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload: Record<string, string> = {
            nama: form.nama,
            deskripsi: form.deskripsi,
            status: form.status,
        };
        if (isBahanKimia) {
            payload.satuan = form.satuan;
        }

        if (editingItem) {
            router.put(`/master-data/${activeTab}/${editingItem.id}`, payload, {
                onFinish: () => {
                    setProcessing(false);
                    closeModal();
                },
            });
        } else {
            router.post(`/master-data/${activeTab}`, payload, {
                onFinish: () => {
                    setProcessing(false);
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (item: MasterDataItem) => {
        if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama}"?`)) {
            router.delete(`/master-data/${activeTab}/${item.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Master Data" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-display-sm font-semibold text-ink">Master Data</h1>
                    <p className="text-body-sm text-mute mt-1">Kelola konfigurasi dasar sistem yang digunakan di seluruh modul.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a]">
                        <div className="p-4 border-b border-hairline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
                                {tabConfig.map((tab) => (
                                    <TabsTrigger key={tab.value} value={tab.value} className="text-body-sm">
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <Button onClick={openCreate} className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Tambah
                            </Button>
                        </div>

                        {tabConfig.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="mt-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                                <th className="py-3 px-4 font-semibold">No</th>
                                                <th className="py-3 px-4 font-semibold">Nama</th>
                                                {tab.value === 'bahan-kimia' && <th className="py-3 px-4 font-semibold">Satuan</th>}
                                                <th className="py-3 px-4 font-semibold">Deskripsi</th>
                                                <th className="py-3 px-4 font-semibold">Status</th>
                                                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                            {dataMap[tab.value] && dataMap[tab.value].length > 0 ? (
                                                dataMap[tab.value].map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-canvas-soft/50 transition-colors">
                                                        <td className="py-3 px-4 text-mute">{index + 1}</td>
                                                        <td className="py-3 px-4 font-medium">{item.nama}</td>
                                                        {tab.value === 'bahan-kimia' && (
                                                            <td className="py-3 px-4 text-body-text">{item.satuan || '-'}</td>
                                                        )}
                                                        <td className="py-3 px-4 text-body-text">
                                                            {item.deskripsi || <span className="text-mute italic">-</span>}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <StatusBadge status={item.status} />
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-body-text hover:text-ink"
                                                                    onClick={() => openEdit(item)}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-error hover:bg-error/10"
                                                                    onClick={() => handleDelete(item)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={tab.value === 'bahan-kimia' ? 6 : 5} className="py-8 text-center text-mute text-body-sm">
                                                        Tidak ada data.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-canvas border border-hairline rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-hairline">
                            <h2 className="text-body-lg font-semibold text-ink">
                                {editingItem ? 'Edit' : 'Tambah'} {tabConfig.find(t => t.value === activeTab)?.label}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeModal}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    placeholder={`Masukkan nama ${tabConfig.find(t => t.value === activeTab)?.label.toLowerCase()}`}
                                    required
                                />
                            </div>
                            {isBahanKimia && (
                                <div className="space-y-2">
                                    <Label htmlFor="satuan">Satuan</Label>
                                    <Input
                                        id="satuan"
                                        value={form.satuan}
                                        onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                                        placeholder="Masukkan satuan"
                                        required
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                    id="deskripsi"
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                    placeholder="Masukkan deskripsi (opsional)"
                                    className="flex w-full rounded-md border border-hairline bg-canvas px-3 py-2 text-body-sm text-ink placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-y"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="tidak_aktif">Tidak Aktif</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={closeModal} className="text-body-sm-strong">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong">
                                    {processing ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Tambah'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
