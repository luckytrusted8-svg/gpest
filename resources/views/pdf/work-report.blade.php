<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #1a1a2e; line-height: 1.5; }
        .page { padding: 35px 45px; }
        .header-table { width: 100%; margin-bottom: 25px; border-bottom: 3px solid #0070f3; padding-bottom: 15px; }
        .header-table td { vertical-align: top; }
        .header-left h1 { font-size: 22px; color: #0070f3; letter-spacing: 1px; margin-bottom: 2px; }
        .header-left p { font-size: 10px; color: #666; }
        .header-right { text-align: right; }
        .header-right .doc-title { font-size: 20px; font-weight: bold; color: #0070f3; text-transform: uppercase; letter-spacing: 2px; }
        .meta-table { width: 100%; margin-bottom: 20px; }
        .meta-table td { padding: 4px 0; vertical-align: top; }
        .meta-label { font-weight: bold; width: 120px; color: #666; font-size: 10px; text-transform: uppercase; }
        .meta-value { font-size: 11px; }
        .section-title { font-size: 12px; font-weight: bold; color: #0070f3; text-transform: uppercase; margin-top: 15px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e0e0e0; }
        .info-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 12px; margin-bottom: 15px; }
        .info-box p { margin-bottom: 3px; font-size: 10.5px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.items th { background: #0070f3; color: white; padding: 7px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
        table.items td { padding: 7px 10px; border-bottom: 1px solid #e0e0e0; font-size: 10.5px; }
        table.items tr:nth-child(even) { background: #f8f9fa; }
        .severity { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .severity-low { background: #e3f2fd; color: #1565c0; }
        .severity-medium { background: #fff3e0; color: #e65100; }
        .severity-high { background: #fce4ec; color: #c62828; }
        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="page">
        {{-- Header --}}
        <table class="header-table">
            <tr>
                <td style="width: 60%;" class="header-left">
                    <h1>G-PEST</h1>
                    <p>Pest Control & Fumigation Services</p>
                    <p>Jl. Contoh No. 123, Jakarta Selatan</p>
                    <p>Telp: (021) 1234-5678 | info@gpest.co.id</p>
                </td>
                <td style="width: 40%;" class="header-right">
                    <div class="doc-title">Laporan Kerja</div>
                    <p style="font-size: 12px; color: #666; margin-top: 5px; font-family: monospace;">{{ $workReport->nomor_laporan }}</p>
                </td>
            </tr>
        </table>

        {{-- Meta Table --}}
        <table class="meta-table">
            <tr>
                <td class="meta-label">Nomor Laporan</td>
                <td class="meta-value" style="font-family: monospace; font-weight: bold;">{{ $workReport->nomor_laporan }}</td>
                <td class="meta-label">Tanggal</td>
                <td class="meta-value">{{ $workReport->tanggal ? \Illuminate\Support\Carbon::parse($workReport->tanggal)->format('d/m/Y') : '-' }}</td>
            </tr>
            <tr>
                <td class="meta-label">Waktu</td>
                <td class="meta-value">{{ $workReport->jam_mulai ?? '-' }} {{ $workReport->jam_selesai ? '- ' . $workReport->jam_selesai : '' }}</td>
                <td class="meta-label">Status</td>
                <td class="meta-value" style="text-transform: uppercase; font-weight: bold;">{{ $workReport->status }}</td>
            </tr>
        </table>

        {{-- Info Customer & Teknisi --}}
        <table style="width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-left: -10px; margin-right: -10px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div class="section-title">Informasi Customer</div>
                    <div class="info-box">
                        <p><strong>{{ $workReport->customer->company_name ?? '-' }}</strong></p>
                        <p>Lokasi: {{ $workReport->customer->location ?? '-' }}</p>
                        <p>PIC: {{ $workReport->customer->pic_name ?? '-' }}</p>
                        <p>Telp: {{ $workReport->customer->phone ?? '-' }}</p>
                    </div>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <div class="section-title">Informasi Teknisi</div>
                    <div class="info-box">
                        <p><strong>{{ $workReport->technician->name ?? '-' }}</strong></p>
                        @if($workReport->contract)
                        <p>Kontrak: {{ $workReport->contract->contract_number }} ({{ $workReport->contract->contract_type }})</p>
                        @endif
                        @if($workReport->schedule)
                        <p>Jadwal: {{ $workReport->schedule->schedule_code }}</p>
                        @endif
                    </div>
                </td>
            </tr>
        </table>

        {{-- Detail Treatment --}}
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

        {{-- Hasil Inspeksi --}}
        <div class="section-title">Hasil Inspeksi</div>
        <div class="info-box">
            <p><strong>Temuan di Lapangan:</strong></p>
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
        <div class="section-title">Rekomendasi Tindak Lanjut</div>
        <div class="info-box">
            <p>{{ $workReport->rekomendasi }}</p>
        </div>
        @endif

        {{-- Dokumentasi Foto --}}
        @php
            $getImageBase64 = function($path) {
                if (empty($path)) return null;
                if (str_starts_with($path, 'data:image')) return $path;
                
                $cleanPath = ltrim($path, '/');
                if (str_starts_with($cleanPath, 'storage/')) {
                    $storageRelative = substr($cleanPath, 8);
                    $fullPath = storage_path('app/public/' . $storageRelative);
                    if (file_exists($fullPath)) {
                        $ext = pathinfo($fullPath, PATHINFO_EXTENSION);
                        if ($ext === 'svg') $ext = 'svg+xml';
                        return 'data:image/' . $ext . ';base64,' . base64_encode(file_get_contents($fullPath));
                    }
                }
                
                $pubPath = public_path($cleanPath);
                if (file_exists($pubPath)) {
                    $ext = pathinfo($pubPath, PATHINFO_EXTENSION);
                    if ($ext === 'svg') $ext = 'svg+xml';
                    return 'data:image/' . $ext . ';base64,' . base64_encode(file_get_contents($pubPath));
                }
                
                return null;
            };
        @endphp

        @if($workReport->photos && $workReport->photos->count() > 0)
        <div class="section-title" style="page-break-before: auto;">Dokumentasi Foto Pekerjaan</div>
        <table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin-bottom: 15px; page-break-inside: avoid;">
            <tr>
                {{-- Sebelum --}}
                <td style="width: 33.33%; vertical-align: top; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px;">
                    <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0070f3; text-align: center; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
                        Sebelum Treatment
                    </div>
                    @forelse($workReport->photos->where('jenis_foto', 'sebelum') as $photo)
                        @php $imgSrc = $getImageBase64($photo->path_foto); @endphp
                        <div style="margin-bottom: 8px; text-align: center;">
                            @if($imgSrc)
                                <img src="{{ $imgSrc }}" style="width: 100%; max-height: 140px; border-radius: 3px; border: 1px solid #ccc;" />
                            @else
                                <div style="height: 60px; background: #eee; border: 1px dashed #ccc; line-height: 60px; font-size: 8px; color: #888;">Foto tidak tersedia</div>
                            @endif
                            @if($photo->keterangan)
                                <div style="font-size: 8.5px; color: #444; margin-top: 2px;">{{ $photo->keterangan }}</div>
                            @endif
                        </div>
                    @empty
                        <div style="padding: 20px 0; text-align: center; font-size: 9px; color: #999; font-style: italic;">Tidak ada foto</div>
                    @endforelse
                </td>

                {{-- Selama --}}
                <td style="width: 33.33%; vertical-align: top; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px;">
                    <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0070f3; text-align: center; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
                        Selama Treatment
                    </div>
                    @forelse($workReport->photos->where('jenis_foto', 'selama') as $photo)
                        @php $imgSrc = $getImageBase64($photo->path_foto); @endphp
                        <div style="margin-bottom: 8px; text-align: center;">
                            @if($imgSrc)
                                <img src="{{ $imgSrc }}" style="width: 100%; max-height: 140px; border-radius: 3px; border: 1px solid #ccc;" />
                            @else
                                <div style="height: 60px; background: #eee; border: 1px dashed #ccc; line-height: 60px; font-size: 8px; color: #888;">Foto tidak tersedia</div>
                            @endif
                            @if($photo->keterangan)
                                <div style="font-size: 8.5px; color: #444; margin-top: 2px;">{{ $photo->keterangan }}</div>
                            @endif
                        </div>
                    @empty
                        <div style="padding: 20px 0; text-align: center; font-size: 9px; color: #999; font-style: italic;">Tidak ada foto</div>
                    @endforelse
                </td>

                {{-- Sesudah --}}
                <td style="width: 33.33%; vertical-align: top; background: #fafafa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px;">
                    <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #0070f3; text-align: center; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
                        Sesudah Treatment
                    </div>
                    @forelse($workReport->photos->where('jenis_foto', 'sesudah') as $photo)
                        @php $imgSrc = $getImageBase64($photo->path_foto); @endphp
                        <div style="margin-bottom: 8px; text-align: center;">
                            @if($imgSrc)
                                <img src="{{ $imgSrc }}" style="width: 100%; max-height: 140px; border-radius: 3px; border: 1px solid #ccc;" />
                            @else
                                <div style="height: 60px; background: #eee; border: 1px dashed #ccc; line-height: 60px; font-size: 8px; color: #888;">Foto tidak tersedia</div>
                            @endif
                            @if($photo->keterangan)
                                <div style="font-size: 8.5px; color: #444; margin-top: 2px;">{{ $photo->keterangan }}</div>
                            @endif
                        </div>
                    @empty
                        <div style="padding: 20px 0; text-align: center; font-size: 9px; color: #999; font-style: italic;">Tidak ada foto</div>
                    @endforelse
                </td>
            </tr>
        </table>
        @endif

        {{-- Catatan Supervisor / Admin --}}
        @if($workReport->catatan_supervisor)
        <div class="section-title">Catatan Review Admin</div>
        <div class="info-box" style="background: #f0f7ff; border-color: #cce3ff;">
            <p>{{ $workReport->catatan_supervisor }}</p>
        </div>
        @endif

        {{-- Tanda Tangan --}}
        <table style="width: 100%; margin-top: 40px; page-break-inside: avoid;">
            <tr>
                <td style="width: 50%; text-align: center;">
                    <div style="font-size: 10px; color: #666; margin-bottom: 50px;">Teknisi Pelaksana</div>
                    <div style="border-top: 1px solid #1a1a2e; width: 180px; margin: 0 auto; padding-top: 5px; font-size: 10px; font-weight: bold;">
                        {{ $workReport->technician->name ?? '-' }}
                    </div>
                </td>
                <td style="width: 50%; text-align: center;">
                    <div style="font-size: 10px; color: #666; margin-bottom: 50px;">Customer / PIC</div>
                    <div style="border-top: 1px solid #1a1a2e; width: 180px; margin: 0 auto; padding-top: 5px; font-size: 10px; font-weight: bold;">
                        {{ $workReport->customer->pic_name ?? ($workReport->customer->company_name ?? '-') }}
                    </div>
                </td>
            </tr>
        </table>

        {{-- Footer --}}
        <div class="footer">
            <p>G-PEST &mdash; Pest Control & Fumigation Services | {{ $workReport->nomor_laporan }}</p>
        </div>
    </div>
</body>
</html>
