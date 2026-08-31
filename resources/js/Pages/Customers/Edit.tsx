import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

interface FormData {
    customer_id: string;
    company_name: string;
    pic_name: string;
    phone: string;
    email: string;
    address: string;
    location: string;
    npwp: string;
    status: 'active' | 'inactive';
    sales_pic: string;
}

interface Props {
    customer: FormData & { id: number };
}

export default function Edit({ customer }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({ ...customer });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/customers/${customer.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Pelanggan: ${customer.company_name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-display-sm font-semibold text-ink">Edit Pelanggan</h1>
                        <p className="text-body-sm text-mute mt-1">Perbarui data pelanggan.</p>
                    </div>
                    <Link href="/customers">
                        <Button variant="outline" className="text-body-sm-strong">Kembali</Button>
                    </Link>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="customer_id" className="text-body-sm-strong text-ink">ID Customer</Label>
                                <Input
                                    id="customer_id"
                                    type="text"
                                    value={data.customer_id}
                                    onChange={(e) => setData('customer_id', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.customer_id && <div className="text-[#ee0000] text-xs mt-1">{errors.customer_id}</div>}
                            </div>

                            <div>
                                <Label htmlFor="company_name" className="text-body-sm-strong text-ink">Nama Perusahaan *</Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.company_name && <div className="text-[#ee0000] text-xs mt-1">{errors.company_name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="pic_name" className="text-body-sm-strong text-ink">Nama PIC *</Label>
                                <Input
                                    id="pic_name"
                                    type="text"
                                    value={data.pic_name}
                                    onChange={(e) => setData('pic_name', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.pic_name && <div className="text-[#ee0000] text-xs mt-1">{errors.pic_name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-body-sm-strong text-ink">Telepon *</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.phone && <div className="text-[#ee0000] text-xs mt-1">{errors.phone}</div>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-body-sm-strong text-ink">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.email && <div className="text-[#ee0000] text-xs mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="location" className="text-body-sm-strong text-ink">Lokasi *</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                                {errors.location && <div className="text-[#ee0000] text-xs mt-1">{errors.location}</div>}
                            </div>

                            <div>
                                <Label htmlFor="npwp" className="text-body-sm-strong text-ink">NPWP (Opsional)</Label>
                                <Input
                                    id="npwp"
                                    type="text"
                                    value={data.npwp}
                                    onChange={(e) => setData('npwp', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.npwp && <div className="text-[#ee0000] text-xs mt-1">{errors.npwp}</div>}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-body-sm-strong text-ink">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                    className="flex h-9 w-full rounded-md border border-hairline bg-canvas px-3 py-1 text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Non-aktif</option>
                                </select>
                                {errors.status && <div className="text-[#ee0000] text-xs mt-1">{errors.status}</div>}
                            </div>

                            <div>
                                <Label htmlFor="sales_pic" className="text-body-sm-strong text-ink">Sales PIC (Opsional)</Label>
                                <Input
                                    id="sales_pic"
                                    type="text"
                                    value={data.sales_pic}
                                    onChange={(e) => setData('sales_pic', e.target.value)}
                                    className="mt-1"
                                />
                                {errors.sales_pic && <div className="text-[#ee0000] text-xs mt-1">{errors.sales_pic}</div>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address" className="text-body-sm-strong text-ink">Alamat *</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                                className="mt-1 min-h-[100px]"
                                required
                            />
                            {errors.address && <div className="text-[#ee0000] text-xs mt-1">{errors.address}</div>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                            <Link href="/customers">
                                <Button type="button" variant="outline" className="text-body-sm-strong">Batal</Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-primary text-on-primary hover:bg-ink text-body-sm-strong"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
