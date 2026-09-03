import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Calendar, Download, User, Clock, ArrowLeft } from 'lucide-react';
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
            <Head title="Rekap Kehadiran" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/attendance">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-display-sm font-semibold text-ink">Rekap Kehadiran Bulanan</h1>
                            <p className="text-body-sm text-mute mt-1">Ringkasan kehadiran seluruh teknisi per bulan.</p>
                        </div>
                    </div>
                    <a href={exportReportUrl}>
                        <Button variant="outline" className="text-body-sm-strong flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Excel
                        </Button>
                    </a>
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] p-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-mute" />
                            <span className="text-body-sm text-ink font-medium">Periode:</span>
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-36"
                        >
                            {MONTHS.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="h-9 px-3 py-1 rounded-md border border-hairline bg-canvas text-body-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-24"
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <Button onClick={applyFilter} variant="outline" className="text-body-sm-strong">
                            Tampilkan
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                        { label: 'Total Hadir', value: totalHadir, color: 'text-[#0070f3]', bg: 'bg-[#0070f3]/10' },
                        { label: 'Tidak Hadir', value: totalTidakHadir, color: 'text-[#ee0000]', bg: 'bg-[#ee0000]/10' },
                        { label: 'Izin', value: totalIzin, color: 'text-[#ab570a]', bg: 'bg-[#f5a623]/10' },
                        { label: 'Sakit', value: totalSakit, color: 'text-[#7928ca]', bg: 'bg-[#7928ca]/10' },
                        { label: 'Total Jam Kerja', value: totalJamKerja.toFixed(1), color: 'text-ink', bg: 'bg-canvas-soft', suffix: 'jam' },
                    ].map((item) => (
                        <div key={item.label} className={`${item.bg} border border-hairline rounded-md p-4 text-center`}>
                            <div className="text-caption text-mute uppercase tracking-wider mb-1">{item.label}</div>
                            <div className={`text-display-sm font-bold ${item.color} font-mono`}>
                                {item.value}{item.suffix ? ` ${item.suffix}` : ''}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-canvas border border-hairline rounded-md shadow-[0px_1px_1px_#00000005,0px_2px_2px_#0000000a] overflow-hidden">
                    <div className="p-4 border-b border-hairline">
                        <h2 className="text-body-md-strong text-ink flex items-center gap-2">
                            <User className="w-4 h-4 text-mute" />
                            Rekap per Teknisi - {monthLabel} {selectedYear}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-hairline bg-canvas-soft text-caption-mono uppercase text-mute">
                                    <th className="py-3 px-4 font-semibold">No</th>
                                    <th className="py-3 px-4 font-semibold">Nama Teknisi</th>
                                    <th className="py-3 px-4 font-semibold text-center">Hadir</th>
                                    <th className="py-3 px-4 font-semibold text-center">Tidak Hadir</th>
                                    <th className="py-3 px-4 font-semibold text-center">Izin</th>
                                    <th className="py-3 px-4 font-semibold text-center">Sakit</th>
                                    <th className="py-3 px-4 font-semibold text-center">Total Jam Kerja</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline text-body-sm text-ink">
                                {reportData.length > 0 ? (
                                    reportData.map((item, idx) => (
                                        <tr key={item.technician_id} className="hover:bg-canvas-soft/50 transition-colors">
                                            <td className="py-3 px-4 text-mute">{idx + 1}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-canvas-soft-2 border border-hairline flex items-center justify-center text-[10px] font-bold text-ink shrink-0">
                                                        {item.nama.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{item.nama}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0070f3]/10 text-[#0070f3] text-xs font-bold font-mono">
                                                    {item.total_hadir}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ee0000]/10 text-[#ee0000] text-xs font-bold font-mono">
                                                    {item.total_tidak_hadir}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f5a623]/10 text-[#ab570a] text-xs font-bold font-mono">
                                                    {item.total_izin}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#7928ca]/10 text-[#7928ca] text-xs font-bold font-mono">
                                                    {item.total_sakit}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-mute" />
                                                    <span className="font-mono text-xs font-medium">{item.total_jam_kerja.toFixed(1)} jam</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-mute text-body-sm">
                                            Belum ada data kehadiran untuk periode ini.
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
