<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if gte mso 9]>
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>Rekap Kehadiran</x:Name>
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
        .meta-table { margin-bottom: 20px; font-size: 10pt; }
        .meta-label { font-weight: bold; color: #334155; width: 140px; }
        .data-table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 10px; }
        .data-table th { background-color: #0F172A; color: #FFFFFF; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #334155; padding: 10px 8px; }
        .data-table td { border: 1px solid #CBD5E1; padding: 8px 10px; vertical-align: middle; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-mono { font-family: 'Consolas', 'Courier New', monospace; }
        .badge-hadir { background-color: #DCFCE7; color: #166534; font-weight: bold; text-align: center; }
        .badge-izin { background-color: #FEF3C7; color: #92400E; font-weight: bold; text-align: center; }
        .badge-sakit { background-color: #F3E8FF; color: #6B21A8; font-weight: bold; text-align: center; }
        .badge-tidak-hadir { background-color: #F1F5F9; color: #475569; font-weight: bold; text-align: center; }
        .row-even { background-color: #F8FAFC; }
        .summary-box { background-color: #F1F5F9; border: 1px solid #CBD5E1; font-weight: bold; }
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="10" class="title-main">G-PEST CONTROL INDONESIA</td>
        </tr>
        <tr>
            <td colspan="10" class="title-sub">Laporan Rekapitulasi Presensi & Kehadiran Teknisi Lapangan</td>
        </tr>
        <tr><td colspan="10"></td></tr>
        <tr>
            <td class="meta-label">Tanggal Laporan</td>
            <td colspan="9">: {{ $tanggal }}</td>
        </tr>
        <tr>
            <td class="meta-label">Waktu Export</td>
            <td colspan="9">: {{ date('d-m-Y H:i:s') }} WIB</td>
        </tr>
        <tr>
            <td class="meta-label">Total Catatan</td>
            <td colspan="9">: {{ count($attendances) }} Data</td>
        </tr>
        <tr><td colspan="10"></td></tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 40px;">No</th>
                <th style="width: 180px;">Nama Teknisi</th>
                <th style="width: 100px;">Tanggal</th>
                <th style="width: 90px;">Jam Masuk</th>
                <th style="width: 90px;">Jam Keluar</th>
                <th style="width: 120px;">Durasi Kerja</th>
                <th style="width: 130px;">Status</th>
                <th style="width: 150px;">Lokasi Masuk (GPS)</th>
                <th style="width: 150px;">Lokasi Keluar (GPS)</th>
                <th style="width: 220px;">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($attendances as $index => $att)
                @php
                    $isEven = $index % 2 === 0;
                    $statusClass = 'badge-tidak-hadir';
                    if ($att->status === 'hadir') $statusClass = 'badge-hadir';
                    elseif ($att->status === 'izin') $statusClass = 'badge-izin';
                    elseif ($att->status === 'sakit') $statusClass = 'badge-sakit';
                @endphp
                <tr class="{{ $isEven ? 'row-even' : '' }}">
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-left" style="font-weight: bold;">{{ $att->technician ? $att->technician->name : 'Teknisi' }}</td>
                    <td class="text-center font-mono">{{ $att->tanggal }}</td>
                    <td class="text-center font-mono">{{ $att->jam_masuk ? substr($att->jam_masuk, 0, 5) : '-' }}</td>
                    <td class="text-center font-mono">{{ $att->jam_keluar ? substr($att->jam_keluar, 0, 5) : '-' }}</td>
                    <td class="text-center font-mono">{{ $att->durasi_kerja ?? '-' }}</td>
                    <td class="{{ $statusClass }}">{{ ucwords(str_replace('_', ' ', $att->status)) }}</td>
                    <td class="text-center font-mono" style="font-size: 9pt;">
                        @if($att->latitude_masuk && $att->longitude_masuk)
                            {{ number_format($att->latitude_masuk, 5) }}, {{ number_format($att->longitude_masuk, 5) }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-center font-mono" style="font-size: 9pt;">
                        @if($att->latitude_keluar && $att->longitude_keluar)
                            {{ number_format($att->latitude_keluar, 5) }}, {{ number_format($att->longitude_keluar, 5) }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-left">{{ $att->catatan ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="text-center" style="padding: 20px; color: #64748B;">Tidak ada data presensi untuk periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="summary-box">
                <td colspan="6" class="text-right" style="padding: 10px;">Total Teknisi Tercatat :</td>
                <td colspan="4" class="text-left" style="padding: 10px;">{{ count($attendances) }} Orang</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
