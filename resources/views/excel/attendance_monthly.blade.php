<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if gte mso 9]>
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>Rekap Bulanan</x:Name>
                    <x:WorksheetOptions>
                        <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                </x:ExcelWorksheet>
            </x:ExcelWorksheets>
        </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1E293B; }
        .title-main { font-size: 16pt; font-weight: bold; color: #0F172A; text-align: left; }
        .title-sub { font-size: 10pt; color: #64748B; margin-bottom: 15px; }
        .meta-label { font-weight: bold; color: #334155; width: 140px; }
        .data-table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 10px; }
        .data-table th { background-color: #0F172A; color: #FFFFFF; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #334155; padding: 10px 8px; }
        .data-table td { border: 1px solid #CBD5E1; padding: 8px 10px; vertical-align: middle; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-mono { font-family: 'Consolas', 'Courier New', monospace; }
        .row-even { background-color: #F8FAFC; }
        .badge-hadir { background-color: #DCFCE7; color: #166534; font-weight: bold; text-align: center; }
        .badge-tidak-hadir { background-color: #FEE2E2; color: #991B1B; font-weight: bold; text-align: center; }
        .badge-izin { background-color: #FEF3C7; color: #92400E; font-weight: bold; text-align: center; }
        .badge-sakit { background-color: #F3E8FF; color: #6B21A8; font-weight: bold; text-align: center; }
        .summary-box { background-color: #F1F5F9; border: 1px solid #CBD5E1; font-weight: bold; }
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="8" class="title-main">G-PEST CONTROL INDONESIA</td>
        </tr>
        <tr>
            <td colspan="8" class="title-sub">Laporan Rekapitulasi Presensi Bulanan Teknisi</td>
        </tr>
        <tr><td colspan="8"></td></tr>
        <tr>
            <td class="meta-label">Bulan / Tahun</td>
            <td colspan="7">: {{ $month }} / {{ $year }}</td>
        </tr>
        <tr>
            <td class="meta-label">Waktu Export</td>
            <td colspan="7">: {{ date('d-m-Y H:i:s') }} WIB</td>
        </tr>
        <tr>
            <td class="meta-label">Total Teknisi</td>
            <td colspan="7">: {{ count($reportData) }} Orang</td>
        </tr>
        <tr><td colspan="8"></td></tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">No</th>
                <th style="width: 220px;">Nama Teknisi</th>
                <th style="width: 90px;">Bulan</th>
                <th style="width: 90px;">Tahun</th>
                <th style="width: 100px;">Total Hadir</th>
                <th style="width: 100px;">Tidak Hadir</th>
                <th style="width: 90px;">Izin</th>
                <th style="width: 90px;">Sakit</th>
                <th style="width: 140px;">Total Jam Kerja</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reportData as $index => $row)
                @php $isEven = $index % 2 === 0; @endphp
                <tr class="{{ $isEven ? 'row-even' : '' }}">
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-left" style="font-weight: bold;">{{ $row['nama'] }}</td>
                    <td class="text-center font-mono">{{ $month }}</td>
                    <td class="text-center font-mono">{{ $year }}</td>
                    <td class="badge-hadir">{{ $row['total_hadir'] }}</td>
                    <td class="badge-tidak-hadir">{{ $row['total_tidak_hadir'] }}</td>
                    <td class="badge-izin">{{ $row['total_izin'] }}</td>
                    <td class="badge-sakit">{{ $row['total_sakit'] }}</td>
                    <td class="text-center font-mono" style="font-weight: bold;">{{ number_format($row['total_jam_kerja'], 1) }} Jam</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center" style="padding: 20px; color: #64748B;">Tidak ada data kehadiran untuk periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
