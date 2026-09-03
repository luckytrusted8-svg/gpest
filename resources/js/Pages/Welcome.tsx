import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    MapPin, Radar, ClipboardList, QrCode, FileText, 
    Check, ArrowUpRight, Building2, Calendar, 
    ArrowRight, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion?: string; phpVersion?: string }>) {
    const [activeTab, setActiveTab] = useState<'tracking' | 'workorder' | 'barcode' | 'portal'>('tracking');

    return (
        <div className="min-h-[100dvh] bg-[#f8fafc] text-[#0f172a] font-sans antialiased selection:bg-[#0f172a] selection:text-white">
            <Head title="G-PEST Enterprise — Sistem Pengendalian Hama Modern" />

            {/* Navigation Bar */}
            <div className="fixed top-0 inset-x-0 z-50 px-4 pt-4 sm:pt-6 pointer-events-none">
                <header className="pointer-events-auto max-w-5xl mx-auto h-14 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <img src="/images/logo.png" alt="G-PEST Logo" className="h-7 w-auto object-contain" />
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center space-x-1 text-xs font-medium text-slate-600">
                        <a href="#fitur" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            Kapabilitas
                        </a>
                        <a href="#console" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            Sistem
                        </a>
                        <a href="#solusi" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            Solusi
                        </a>
                        <a href="#paket" className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-100 transition-colors">
                            Paket Layanan
                        </a>
                    </nav>

                    {/* CTAs */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="/portal/login"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Portal Klien</span>
                        </Link>

                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-xs transition-colors"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-xs transition-colors"
                            >
                                <span>Masuk</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>
                </header>
            </div>

            {/* Hero Section */}
            <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Clean Sub-header / Category Tag */}
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Sistem Informasi Manajemen Operasional Terpadu
                    </p>

                    {/* Display Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.15]">
                        Standard Baru Pengendalian Hama & Manajemen Lapangan.
                    </h1>

                    {/* Subheading */}
                    <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Platform operasional modern untuk pelacakan armada GPS real-time, digital work order paperless, monitoring barcode bait station, dan portal klien 24/7.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
                            >
                                <span>Buka Workspace</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-colors"
                            >
                                <span>Masuk ke Sistem</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}

                        <Link
                            href="/portal/login"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
                        >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span>Portal Pelanggan</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                            <div className="text-xl font-bold font-mono text-slate-900">99.9%</div>
                            <div className="text-xs text-slate-500 mt-1">Akurasi GPS Dispatch</div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                            <div className="text-xl font-bold font-mono text-slate-900">100%</div>
                            <div className="text-xs text-slate-500 mt-1">Digital Paperless BAP</div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                            <div className="text-xl font-bold font-mono text-slate-900">ISO</div>
                            <div className="text-xs text-slate-500 mt-1">Standar Kualitas & K3</div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
                            <div className="text-xl font-bold font-mono text-slate-900">24/7</div>
                            <div className="text-xs text-slate-500 mt-1">Portal Mandiri Klien</div>
                        </div>
                    </div>
                </div>

                {/* Clean Interactive Console Mockup */}
                <div id="console" className="mt-16 max-w-5xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {/* Window Topbar */}
                        <div className="h-12 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                            </div>

                            {/* Interactive Tab Pills */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
                                <button
                                    onClick={() => setActiveTab('tracking')}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        activeTab === 'tracking'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Lacak Teknisi
                                </button>
                                <button
                                    onClick={() => setActiveTab('workorder')}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        activeTab === 'workorder'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Work Order & BAP
                                </button>
                                <button
                                    onClick={() => setActiveTab('barcode')}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        activeTab === 'barcode'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Bait Station
                                </button>
                                <button
                                    onClick={() => setActiveTab('portal')}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        activeTab === 'portal'
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Portal Pelanggan
                                </button>
                            </div>

                            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                                SYSTEM LIVE
                            </div>
                        </div>

                        {/* Console Content */}
                        <div className="p-6 sm:p-8">
                            {activeTab === 'tracking' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="text-base font-semibold text-slate-900">Pemantauan Teknisi Lapangan Real-Time</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Monitoring koordinat GPS, geofence radius, dan estimasi waktu tiba</div>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-medium border border-emerald-200">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>GPS CONNECTED</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-900">Ahmad Fauzi</span>
                                                <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-white rounded-md font-mono font-medium">ON SITE</span>
                                            </div>
                                            <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="truncate">PT Megah Perkasa - Site A</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-1 font-mono">Status: Treatment Rodent</div>
                                        </div>

                                        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-900">Budi Santoso</span>
                                                <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-mono font-medium">TRAVELING</span>
                                            </div>
                                            <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="truncate">Menuju Mall Grand City</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-1 font-mono">Kecepatan: 32 km/h · ETA: 10m</div>
                                        </div>

                                        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-900">Dedi Hermawan</span>
                                                <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono font-medium">SELESAI</span>
                                            </div>
                                            <div className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="truncate">Restoran Rasa Nusantara</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-1 font-mono">BAP Digital Approved (11:20)</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'workorder' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-semibold text-slate-900">Perintah Kerja & Berita Acara Digital (BAP)</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Pembuatan Berita Acara Pekerjaan dengan tanda tangan digital resmi</div>
                                        </div>
                                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">ISO COMPLIANT</span>
                                    </div>

                                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                                        <div className="grid grid-cols-4 bg-slate-50 p-3 font-mono font-semibold text-slate-500 border-b border-slate-200">
                                            <div>NO. WO</div>
                                            <div>KLIEN</div>
                                            <div>METODE</div>
                                            <div>STATUS</div>
                                        </div>
                                        <div className="grid grid-cols-4 p-3 border-b border-slate-200 items-center">
                                            <div className="font-mono font-semibold text-slate-900">WO-2026-0891</div>
                                            <div className="font-medium">PT Central Logistik</div>
                                            <div className="text-slate-600">Rodent & Insect Control</div>
                                            <div><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px]">Tuntas & Signed</span></div>
                                        </div>
                                        <div className="grid grid-cols-4 p-3 items-center bg-slate-50/40">
                                            <div className="font-mono font-semibold text-slate-900">WO-2026-0892</div>
                                            <div className="font-medium">Hotel Grand Kartika</div>
                                            <div className="text-slate-600">Misting & Fogging Nyamuk</div>
                                            <div><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px]">Dalam Proses</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'barcode' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-semibold text-slate-900">Peta Stasiun Baiting & Barcode Scanner</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Monitoring perangkap hama industri via QR Code / Barcode</div>
                                        </div>
                                        <span className="text-xs font-mono text-slate-700 font-semibold">QR SCANNER READY</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                            <div className="text-2xl font-bold font-mono text-slate-900">142</div>
                                            <div className="text-xs text-slate-500 mt-1">Bait Station Terpasang</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                            <div className="text-2xl font-bold font-mono text-emerald-600">138</div>
                                            <div className="text-xs text-slate-500 mt-1">Sudah Diinspeksi</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                            <div className="text-2xl font-bold font-mono text-amber-600">4</div>
                                            <div className="text-xs text-slate-500 mt-1">Perlu Refill Umpan</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'portal' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-semibold text-slate-900">Akses Portal Klien 24/7</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Transparansi penuh untuk klien mengunduh BAP dan laporan berkala</div>
                                        </div>
                                        <span className="text-xs font-mono text-emerald-700">CLIENT TRUST 100%</span>
                                    </div>

                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-xs">
                                                PDF
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-900">Laporan Hasil Treatment Periode Agustus 2026</div>
                                                <div className="text-[11px] text-slate-500">Site: Gudang Barat Logistik · Verified by Supervisor</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-900 hover:underline cursor-pointer">
                                            Unduh BAP →
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="fitur" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
                <div className="max-w-3xl mx-auto text-center mb-14">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        FITUR UTAMA
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Dirancang untuk Menjawab Kebutuhan Operasional Lapangan.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                                <Radar className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Live Dispatch Radar & Geofence Intelligence
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-lg">
                                Pantau rute perjalanan teknisi secara real-time, verifikasi radius geofence di lokasi pelanggan, dan cegah manipulasi absensi secara otomatis.
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs font-mono text-slate-500">
                            <div>GPS SAMPLING: 5S</div>
                            <div>GEOFENCE RADIUS: 100M</div>
                            <div>ROUTE REPLAY: READY</div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Barcode Bait Stations
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Scan titik umpan secara instan di setiap lokasi pabrik atau gedung untuk mencatat level hama dan kebutuhan refill bahan kimia.
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 text-xs font-mono text-slate-500">
                            SUPPORT: QR / BARCODE / RFID
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                                <ClipboardList className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Digital Work Order & BAP
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                Tanda tangan digital langsung di aplikasi teknisi dengan penerbitan Berita Acara Pekerjaan instan berstandar ISO.
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 text-xs font-mono text-slate-500">
                            FORMAT: PDF EXPORT & E-SIGN
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Dedicated Client Self-Service Portal
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-lg">
                                Berikan portal mandiri bagi klien korporat Anda untuk memantau jadwal kunjungan, riwayat inspeksi, invoice tagihan, dan tiket komplain kapan saja.
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs font-mono text-slate-500">
                            <div>24/7 ACCESS</div>
                            <div>AUTOMATED INVOICING</div>
                            <div>TICKET COMPLAINT</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Tiers */}
            <section id="paket" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
                <div className="max-w-3xl mx-auto text-center mb-14">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        PAKET LAYANAN
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Pilihan Paket Sesuai Kebutuhan Bisnis.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Tier 1 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-mono text-slate-500 uppercase font-semibold">BISNIS KOMERSIAL</div>
                            <h3 className="text-2xl font-semibold text-slate-900 mt-2">Komersial & Ritel</h3>
                            <p className="text-xs text-slate-600 mt-2">Cocok untuk restoran, kafe, ruko, dan kantor cabang.</p>

                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Treatment Berkala Terjadwal</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Digital BAP & Berita Acara</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Akses Portal Pelanggan</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Emergency Call Response</div>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="mt-8 w-full py-2.5 px-4 text-center text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors block"
                        >
                            Pilih Paket Ini
                        </Link>
                    </div>

                    {/* Tier 2 (Featured Slate Card) */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-mono text-slate-400 uppercase font-semibold">INDUSTRI & LOGISTIK</div>
                            <h3 className="text-2xl font-semibold text-white mt-2">Enterprise Industri</h3>
                            <p className="text-xs text-slate-300 mt-2">Pabrik, gudang logistik, rumah sakit, dan area luas.</p>

                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-slate-200">
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-300 shrink-0" /> Barcode Bait Station Scanning</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-300 shrink-0" /> GPS Tracking & Geofencing</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-300 shrink-0" /> Audit Standar ISO & K3</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-300 shrink-0" /> Response Time & Emergency 24/7</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-300 shrink-0" /> Dedicated Account Manager</div>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="mt-8 w-full py-2.5 px-4 text-center text-xs font-medium text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors block font-semibold"
                        >
                            Hubungi Konsultan Kami
                        </Link>
                    </div>

                    {/* Tier 3 */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                        <div>
                            <div className="text-xs font-mono text-slate-500 uppercase font-semibold">CUSTOM HOLDING</div>
                            <h3 className="text-2xl font-semibold text-slate-900 mt-2">Multi-Site Holding</h3>
                            <p className="text-xs text-slate-600 mt-2">Solusi terintegrasi untuk jaringan ritel dan korporasi nasional.</p>

                            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Konsolidasi Billing Multi-Cabang</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Custom SLA & Treatment Protocol</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Integrasi API & ERP System</div>
                                <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-slate-800 shrink-0" /> Laporan Eksekutif Bulanan</div>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="mt-8 w-full py-2.5 px-4 text-center text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors block"
                        >
                            Konsultasi Custom
                        </Link>
                    </div>
                </div>
            </section>

            {/* Clean Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 text-slate-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
                        <div className="space-y-3">
                            <img src="/images/logo.png" alt="G-PEST Logo" className="h-7 w-auto object-contain" />
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Platform operasional pengendalian hama terintegrasi dengan pelacakan teknisi dan digital work order otomatis.
                            </p>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                                Platform
                            </div>
                            <ul className="space-y-2 text-xs">
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Pelacakan GPS & Geofence</a></li>
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Digital Work Order & BAP</a></li>
                                <li><a href="#fitur" className="hover:text-slate-900 transition-colors">Barcode Bait Station</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                                Akses Portal
                            </div>
                            <ul className="space-y-2 text-xs">
                                <li><Link href="/login" className="hover:text-slate-900 transition-colors">Masuk ke Sistem</Link></li>
                                <li><Link href="/portal/login" className="hover:text-slate-900 transition-colors">Portal Pelanggan</Link></li>
                                <li><a href="#paket" className="hover:text-slate-900 transition-colors">Daftar Paket</a></li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
                                Kontak
                            </div>
                            <div className="text-xs text-slate-500 space-y-1">
                                <div className="text-slate-900 font-medium">G-PEST CONTROL INDONESIA</div>
                                <div>Dukungan Operasional 24/7</div>
                                <div className="font-mono text-slate-800">info@gpest.id</div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono">
                        <div>© {new Date().getFullYear()} G-PEST CONTROL. ALL RIGHTS RESERVED.</div>
                        <div className="mt-2 sm:mt-0">ENTERPRISE SYSTEM v2.0</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
