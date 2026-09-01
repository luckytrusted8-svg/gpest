import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, MapPin, Building2, Phone, Edit, ClipboardList } from 'lucide-react';

interface WorkOrder {
    id: number;
    wo_number: string;
    service_type: string;
    status: string;
    created_at: string;
    technician?: { name: string };
}

interface Site {
    id: number;
    site_code: string;
    site_name: string;
    address: string;
    pic_name: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    geofence_radius: number;
    service_area: string | null;
    customer?: { company_name: string };
    work_orders: WorkOrder[];
}

interface Props {
    site: Site;
}

export default function SitesShow({ site }: Props) {
    return (
        <AppLayout>
            <Head title={`Detail Site ${site.site_name}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/sites">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="font-mono text-xs text-blue-600 font-bold">{site.site_code}</div>
                            <h1 className="text-display-sm font-semibold text-ink mt-0.5">{site.site_name}</h1>
                        </div>
                    </div>

                    <Link href={`/sites/${site.id}/edit`}>
                        <Button className="bg-primary text-on-primary hover:bg-ink text-xs flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit Site
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-4 text-xs">
                            <h3 className="font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2">
                                Informasi Lokasi & Alamat
                            </h3>
                            <div>
                                <span className="text-mute">Pelanggan:</span>
                                <p className="font-semibold text-ink mt-0.5">{site.customer?.company_name ?? '-'}</p>
                            </div>
                            <div>
                                <span className="text-mute">Alamat Lengkap:</span>
                                <p className="text-ink mt-0.5">{site.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-mute">PIC Lokasi:</span>
                                    <p className="font-medium text-ink mt-0.5">{site.pic_name || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-mute">No. Telepon PIC:</span>
                                    <p className="font-medium text-ink mt-0.5">{site.phone || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Work Orders History on this Site */}
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-3 text-xs">
                            <h3 className="font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-blue-600" /> Histori Work Order di Site Ini
                            </h3>
                            {site.work_orders.length > 0 ? (
                                <div className="divide-y divide-hairline">
                                    {site.work_orders.map((wo) => (
                                        <div key={wo.id} className="py-2.5 flex justify-between items-center">
                                            <div>
                                                <Link href={`/work-orders/${wo.id}`} className="font-bold text-blue-600 hover:underline">
                                                    {wo.wo_number}
                                                </Link>
                                                <div className="text-mute">{wo.service_type} &middot; Teknisi: {wo.technician?.name ?? '-'}</div>
                                            </div>
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 uppercase">
                                                {wo.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-mute italic">Belum ada Work Order dikaitkan dengan site ini.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-canvas border border-hairline rounded-md p-5 shadow-xs space-y-3 text-xs">
                            <h3 className="font-bold uppercase tracking-wider text-mute border-b border-hairline pb-2 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-blue-600" /> Geofence & Koordinat GPS
                            </h3>
                            <div>
                                <span className="text-mute">Latitude:</span>
                                <p className="font-mono text-ink mt-0.5">{site.latitude || 'Belum Diatur'}</p>
                            </div>
                            <div>
                                <span className="text-mute">Longitude:</span>
                                <p className="font-mono text-ink mt-0.5">{site.longitude || 'Belum Diatur'}</p>
                            </div>
                            <div>
                                <span className="text-mute">Radius Geofence:</span>
                                <p className="font-bold text-blue-700 mt-0.5">{site.geofence_radius} Meter</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
