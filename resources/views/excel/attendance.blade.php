<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Kehadiran</title>
    <style>
        body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1E293B; }
        .title-main { font-size: 16pt; font-weight: bold; color: #0F172A; text-align: left; }
        .title-sub { font-size: 10pt; color: #64748B; margin-bottom: 15px; }
        .meta-label { font-weight: bold; color: #334155; }
        .data-table { border-collapse: collapse; width: 100%; font-size: 10pt; margin-top: 10px; }
        .data-table th { background-color: #0F172A; color: #FFFFFF; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #334155; padding: 10px 8px; }
        .data-table td { border: 1px solid #CBD5E1; padding: 8px 10px; vertical-align: middle; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .font-mono { font-family: Consolas, 'Courier New', monospace; }
        .badge-hadir { background-color: #DCFCE7; color: #166534; font-weight: bold; text-align: center; }
        .badge-izin { background-color: #FEF3C7; color: #92400E; font-weight: bold; text-align: center; }
        .badge-sakit { background-color: #F3E8FF; color: #6B21A8; font-weight: bold; text-align: center; }
        .badge-tidak-hadir { background-color: #F1F5F9; color: #475569; font-weight: bold; text-align: center; }
        .row-even { background-color: #F8FAFC; }
        .summary-box { background-color: #F1F5F9; border: 1px solid #CBD5E1; font-weight: bold; }
    </style>
</head>
<body>
    <table border="0" style="margin-bottom: 15px;">
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

    <table class="data-table" border="1" cellpadding="6" cellspacing="0">
        <thead>
            <tr>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 40px;">No</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 180px;">Nama Teknisi</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 100px;">Tanggal</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 90px;">Jam Masuk</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 90px;">Jam Keluar</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 120px;">Durasi Kerja</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 130px;">Status</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 150px;">Lokasi Masuk (GPS)</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 150px;">Lokasi Keluar (GPS)</th>
                <th style="background-color: #0F172A; color: #FFFFFF; width: 220px;">Catatan</th>
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
                    <td class="text-center" style="border: 1px solid #CBD5E1;">{{ $index + 1 }}</td>
                    <td class="text-left" style="font-weight: bold; border: 1px solid #CBD5E1;">{{ $att->technician ? $att->technician->name : 'Teknisi' }}</td>
                    <td class="text-center font-mono" style="border: 1px solid #CBD5E1;">{{ \Carbon\Carbon::parse($att->tanggal)->format('d-m-Y') }}</td>
                    <td class="text-center font-mono" style="border: 1px solid #CBD5E1;">{{ $att->jam_masuk ? \Carbon\Carbon::parse($att->jam_masuk)->format('H:i') : '-' }}</td>
                    <td class="text-center font-mono" style="border: 1px solid #CBD5E1;">{{ $att->jam_keluar ? \Carbon\Carbon::parse($att->jam_keluar)->format('H:i') : '-' }}</td>
                    <td class="text-center font-mono" style="border: 1px solid #CBD5E1;">{{ $att->durasi_kerja ?? '-' }}</td>
                    <td class="{{ $statusClass }}" style="border: 1px solid #CBD5E1;">{{ ucwords(str_replace('_', ' ', $att->status)) }}</td>
                    <td class="text-center font-mono" style="font-size: 9pt; border: 1px solid #CBD5E1;">
                        @if($att->latitude_masuk && $att->longitude_masuk)
                            {{ number_format($att->latitude_masuk, 5) }}, {{ number_format($att->longitude_masuk, 5) }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-center font-mono" style="font-size: 9pt; border: 1px solid #CBD5E1;">
                        @if($att->latitude_keluar && $att->longitude_keluar)
                            {{ number_format($att->latitude_keluar, 5) }}, {{ number_format($att->longitude_keluar, 5) }}
                        @else
                            -
                        @endif
                    </td>
                    <td class="text-left" style="border: 1px solid #CBD5E1;">{{ $att->catatan ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="text-center" style="padding: 20px; color: #64748B; border: 1px solid #CBD5E1;">Tidak ada data presensi untuk periode ini.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="summary-box">
                <td colspan="6" class="text-right" style="padding: 10px; font-weight: bold; border: 1px solid #CBD5E1;">Total Teknisi Tercatat :</td>
                <td colspan="4" class="text-left" style="padding: 10px; font-weight: bold; border: 1px solid #CBD5E1;">{{ count($attendances) }} Orang</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
