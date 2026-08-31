<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #1a1a2e; line-height: 1.5; }
        .page { padding: 40px 50px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #0070f3; padding-bottom: 20px; }
        .header-left h1 { font-size: 22px; color: #0070f3; letter-spacing: 1px; margin-bottom: 2px; }
        .header-left p { font-size: 10px; color: #666; }
        .header-right { text-align: right; }
        .header-right .doc-title { font-size: 20px; font-weight: bold; color: #0070f3; text-transform: uppercase; letter-spacing: 2px; }
        .meta-table { width: 100%; margin-bottom: 20px; }
        .meta-table td { padding: 4px 0; vertical-align: top; }
        .meta-label { font-weight: bold; width: 120px; color: #666; font-size: 10px; text-transform: uppercase; }
        .meta-value { font-size: 11px; }
        .section-title { font-size: 12px; font-weight: bold; color: #0070f3; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e0e0e0; }
        .info-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-bottom: 20px; }
        .info-box p { margin-bottom: 3px; font-size: 10.5px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items th { background: #0070f3; color: white; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
        table.items td { padding: 8px 10px; border-bottom: 1px solid #e0e0e0; font-size: 10.5px; }
        table.items tr:nth-child(even) { background: #f8f9fa; }
        .photo-grid { display: flex; gap: 10px; margin-bottom: 20px; }
        .photo-grid .col { flex: 1; }
        .photo-grid .col h4 { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 5px; text-align: center; }
        .photo-placeholder { width: 100%; height: 80px; background: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 9px; border-radius: 4px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-block { width: 200px; text-align: center; }
        .sig-line { border-top: 1px solid #1a1a2e; margin-top: 50px; padding-top: 5px; font-size: 10px; }
        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; }
        .severity { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .severity-low { background: #e3f2fd; color: #1565c0; }
        .severity-medium { background: #fff3e0; color: #e65100; }
        .severity-high { background: #fce4ec; color: #c62828; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="header-left">
                <h1>G-PEST</h1>
                <p>Pest Control & Fumigation Services</p>
                <p>Jl. Contoh No. 123, Jakarta Selatan</p>
                <p>Telp: (021) 1234-5678 | info@gpest.co.id</p>
            </div>
            <div class="header-right">
                <div class="doc-title">Laporan Kerja</div>
                <p style="font-size: 12px; color: #666; margin-top: 5px; font-family: monospace;">{{ $workReport->nomor_laporan }}</p>
            </div>
        </div>

        <table class="meta-table">
            <tr>
                <td class="meta-label">Nomor Laporan</td>
                <td class="meta-value" style="font-family: monospace; font-weight: bold;">{{ $workReport->nomor_laporan }}</td>
                <td class="meta-label">Tanggal</td>
                <td class="meta-value">{{ $workReport->tanggal ? $workReport->tanggal->format('d/m/Y') : '-' }}</td>
            </tr>
            <tr>
                <td class="meta-label">Waktu</td>
                <td class="meta-value">{{ $workReport->jam_mulai ?? '-' }} {{ $workReport->jam_selesai ? '- ' . $workReport->jam_selesai : '' }}</td>
                <td class="meta-label">Status</td>
                <td class="meta-value" style="text-transform: uppercase; font-weight: bold;">{{ $workReport->status }}</td>
            </tr>
        </table>

        <div class="section-title">Informasi Customer</div>
        <div class="info-box">
            <p><strong>{{ $workReport->customer->company_name ?? '-' }}</strong></p>
            <p>Lokasi: {{ $workReport->customer->location ?? '-' }}</p>
            <p>PIC: {{ $workReport->customer->pic_name ?? '-' }}</p>
            <p>Telp: {{ $workReport->customer->phone ?? '-' }}</p>
        </div>

        <div class="section-title">Informasi Teknisi</div>
        <div class="info-box">
            <p><strong>{{ $workReport->technician->name ?? '-' }}</strong></p>
            @if($workReport->contract)
            <p>Kontrak: {{ $workReport->contract->contract_number }}</p>
            @endif
        </div>

        <div class="section-title">Detail Treatment</div>
        <table class="items">
            <thead>
                <tr>
                    <th style="width: 30%;">Item</th>
                    <th>Detail</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight: bold;">Jenis Layanan</td>
                    <td>{{ $workReport->jenis_layanan }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Jenis Hama</td>
                    <td>{{ $workReport->jenis_hama ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Metode Treatment</td>
                    <td>{{ $workReport->metode_treatment ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Bahan Kimia</td>
                    <td>{{ $workReport->bahan_kimia ?? '-' }} {{ $workReport->jumlah_bahan ? '(' . $workReport->jumlah_bahan . ')' : '' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Area Treatment</td>
                    <td>{{ $workReport->area_treatment ?? '-' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Peralatan</td>
                    <td>{{ $workReport->peralatan ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">Hasil Inspeksi</div>
        <div class="info-box">
            <p><strong>Temuan:</strong></p>
            <p>{{ $workReport->temuan ?? '-' }}</p>
            <br>
            <p><strong>Aktivitas Hama:</strong> {{ $workReport->aktivitas_hama ?? '-' }}</p>
            <p><strong>Tingkat Keparahan:</strong> 
                @if($workReport->tingkat_keparahan === 'Rendah')
                    <span class="severity severity-low">Rendah</span>
                @elseif($workReport->tingkat_keparahan === 'Sedang')
                    <span class="severity severity-medium">Sedang</span>
                @elseif(in_array($workReport->tingkat_keparahan, ['Tinggi', 'Sangat Tinggi']))
                    <span class="severity severity-high">{{ $workReport->tingkat_keparahan }}</span>
                @else
                    {{ $workReport->tingkat_keparahan ?? '-' }}
                @endif
            </p>
        </div>

        @if($workReport->rekomendasi)
        <div class="section-title">Rekomendasi</div>
        <div class="info-box">
            <p>{{ $workReport->rekomendasi }}</p>
        </div>
        @endif

        @if($workReport->photos && $workReport->photos->count() > 0)
        <div class="section-title">Dokumentasi Foto</div>
        <div class="photo-grid">
            <div class="col">
                <h4>Sebelum</h4>
                @foreach($workReport->photos->where('jenis_foto', 'sebelum') as $photo)
                    <div class="photo-placeholder">Foto: {{ $photo->keterangan ?? 'Sebelum' }}</div>
                @endforeach
                @if($workReport->photos->where('jenis_foto', 'sebelum')->isEmpty())
                    <div class="photo-placeholder">Tidak ada foto</div>
                @endif
            </div>
            <div class="col">
                <h4>Selama</h4>
                @foreach($workReport->photos->where('jenis_foto', 'selama') as $photo)
                    <div class="photo-placeholder">Foto: {{ $photo->keterangan ?? 'Selama' }}</div>
                @endforeach
                @if($workReport->photos->where('jenis_foto', 'selama')->isEmpty())
                    <div class="photo-placeholder">Tidak ada foto</div>
                @endif
            </div>
            <div class="col">
                <h4>Sesudah</h4>
                @foreach($workReport->photos->where('jenis_foto', 'sesudah') as $photo)
                    <div class="photo-placeholder">Foto: {{ $photo->keterangan ?? 'Sesudah' }}</div>
                @endforeach
                @if($workReport->photos->where('jenis_foto', 'sesudah')->isEmpty())
                    <div class="photo-placeholder">Tidak ada foto</div>
                @endif
            </div>
        </div>
        @endif

        @if($workReport->catatan_supervisor)
        <div class="section-title">Catatan Supervisor</div>
        <div class="info-box">
            <p>{{ $workReport->catatan_supervisor }}</p>
        </div>
        @endif

        <div class="signatures">
            <div class="sig-block">
                <div class="sig-line">Teknisi</div>
                <p style="font-size: 10px; margin-top: 5px;">{{ $workReport->technician->name ?? '-' }}</p>
            </div>
            <div class="sig-block">
                <div class="sig-line">Customer</div>
                <p style="font-size: 10px; margin-top: 5px;">{{ $workReport->customer->company_name ?? '-' }}</p>
            </div>
        </div>

        <div class="footer">
            <p>G-PEST &mdash; Pest Control & Fumigation Services | {{ $workReport->nomor_laporan }}</p>
        </div>
    </div>
</body>
</html>
