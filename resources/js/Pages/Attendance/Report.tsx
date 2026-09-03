import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Calendar, Download, User, Clock, ArrowLeft, Users, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ReportItem {
    technician_id: number;
    nama: string;
    total_hadir: number;
    total_tidak_hadir: number;
    total_izin: number;
    total_sakit: number;
    total_jam_kerja: number;
}

interface Props {
    reportData: ReportItem[];
    technicians: { id: number; name: string }[];
    month: string;
    year: string;
}

const MONTHS = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

const YEARS = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - 2 + i));

export default function Report({ reportData, technicians, month, year }: Props) {
    const [selectedMonth, setSelectedMonth] = useState(month);
    const [selectedYear, setSelectedYear] = useState(year);

    const applyFilter = () => {
        router.get('/attendance/report', { month: selectedMonth, year: selectedYear }, { preserveState: true, replace: true });
    };

    const totalHadir = reportData.reduce((sum, r) => sum + r.total_hadir, 0);
    const totalTidakHadir = reportData.reduce((sum, r) => sum + r.total_tidak_hadir, 0);
    const totalIzin = reportData.reduce((sum, r) => sum + r.total_izin, 0);
    const totalSakit = reportData.reduce((sum, r) => sum + r.total_sakit, 0);
    const totalJamKerja = reportData.reduce((sum, r) => sum + r.total_jam_kerja, 0);

    const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label ?? selectedMonth;
    const exportReportUrl = `/attendance/report/export-csv?month=${encodeURIComponent(selectedMonth)}&year=${encodeURIComponent(selectedYear)}`;

    return (
        <AppLayout>
            <Head title={`Rekap Kehadiran ${monthLabel} ${selectedYear} - G-PEST`} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/attendance">
                            <button
                                type="button"
                                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                                title="Kembali ke Presensi"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <span>Rekap Kehadiran Bulanan</span>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono">{monthLabel} {selectedYear}</span>
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">Ringkasan dan akumulasi kehadiran seluruh teknisi lapangan per bulan.</p>
                        </div>
                    </div>

                    <a
                        href={exportReportUrl}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                        title="Export rekap bulanan ke file Excel (.csv)"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Excel</span>
                    </a>
                </div>

                {/* Filter Period Bar */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Pilih Periode:</span>
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full sm:w-44"
                        >
                            {MONTHS.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full sm:w-32"
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={applyFilter}
                            className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs w-full sm:w-auto"
                        >
                            Tampilkan
                        </button>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Hadir</div>
                        <div className="text-2xl font-bold text-blue-600 font-mono">
                            {totalHadir}
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tidak Hadir</div>
                        <div className="text-2xl font-bold text-rose-600 font-mono">
                            {totalTidakHadir}
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Izin</div>
                        <div className="text-2xl font-bold text-amber-600 font-mono">
                            {totalIzin}
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sakit</div>
                        <div className="text-2xl font-bold text-purple-600 font-mono">
                            {totalSakit}
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs text-center col-span-2 sm:col-span-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Jam Kerja</div>
                        <div className="text-2xl font-bold text-slate-900 font-mono">
                            {totalJamKerja.toFixed(1)} <span className="text-xs font-normal text-slate-500">jam</span>
                        </div>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span>Rekapitulasi per Teknisi — {monthLabel} {selectedYear}</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-5 py-3.5">No</th>
                                    <th className="px-5 py-3.5">Nama Teknisi</th>
                                    <th className="px-5 py-3.5 text-center">Hadir</th>
                                    <th className="px-5 py-3.5 text-center">Tidak Hadir</th>
                                    <th className="px-5 py-3.5 text-center">Izin</th>
                                    <th className="px-5 py-3.5 text-center">Sakit</th>
                                    <th className="px-5 py-3.5 text-center">Total Jam Kerja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {reportData.length > 0 ? (
                                    reportData.map((item, idx) => (
                                        <tr key={item.technician_id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
                                                        {item.nama ? item.nama.charAt(0).toUpperCase() : 'T'}
                                                    </div>
                                                    <span className="font-bold text-slate-900">{item.nama}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                                                    {item.total_hadir}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold font-mono">
                                                    {item.total_tidak_hadir}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold font-mono">
                                                    {item.total_izin}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold font-mono">
                                                    {item.total_sakit}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{item.total_jam_kerja.toFixed(1)} jam</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400">
                                            <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                                            <div className="font-bold text-slate-700 text-sm">Belum ada data kehadiran untuk periode ini</div>
                                            <div className="text-xs text-slate-400 mt-0.5">Silakan pilih bulan atau tahun lain.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
