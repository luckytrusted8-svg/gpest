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
        .hama-tag { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 10px; font-size: 10px; margin-right: 5px; margin-bottom: 5px; }
        .risk-box { padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
        .risk-rendah { background: #e3f2fd; border: 1px solid #90caf9; color: #1565c0; }
        .risk-sedang { background: #fff3e0; border: 1px solid #ffcc80; color: #e65100; }
        .risk-tinggi { background: #fce4ec; border: 1px solid #ef9a9a; color: #c62828; }
        .risk-kritis { background: #c62828; border: 1px solid #c62828; color: white; }
        .risk-label { font-size: 14px; font-weight: bold; text-transform: uppercase; }
        .photo-grid { display: flex; gap: 10px; margin-bottom: 20px; }
        .photo-grid .col { flex: 1; }
        .photo-placeholder { width: 100%; height: 80px; background: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; font-size: 9px; border-radius: 4px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-block { width: 200px; text-align: center; }
        .sig-line { border-top: 1px solid #1a1a2e; margin-top: 50px; padding-top: 5px; font-size: 10px; }
        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; }
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
                <div class="doc-title">Laporan Survey</div>
                <p style="font-size: 12px; color: #666; margin-top: 5px; font-family: monospace;">{{ $surveyReport->nomor_survey }}</p>
            </div>
        </div>

        <table class="meta-table">
            <tr>
                <td class="meta-label">Nomor Survey</td>
                <td class="meta-value" style="font-family: monospace; font-weight: bold;">{{ $surveyReport->nomor_survey }}</td>
                <td class="meta-label">Tanggal</td>
                <td class="meta-value">{{ $surveyReport->tanggal_survey ? $surveyReport->tanggal_survey->format('d/m/Y') : '-' }}</td>
            </tr>
            <tr>
                <td class="meta-label">Status</td>
                <td class="meta-value" style="text-transform: uppercase; font-weight: bold;">{{ $surveyReport->status }}</td>
                <td class="meta-label">Teknisi</td>
                <td class="meta-value">{{ $surveyReport->technician->name ?? '-' }}</td>
            </tr>
        </table>

        <div class="section-title">Informasi Customer</div>
        <div class="info-box">
            <p><strong>{{ $surveyReport->customer->company_name ?? '-' }}</strong></p>
            <p>Lokasi Survey: {{ $surveyReport->lokasi ?? '-' }}</p>
            <p>PIC: {{ $surveyReport->customer->pic_name ?? '-' }}</p>
            <p>Telp: {{ $surveyReport->customer->phone ?? '-' }}</p>
        </div>

        <div class="section-title">Jenis Hama</div>
        <div class="info-box">
            @if($surveyReport->jenis_hama && count($surveyReport->jenis_hama) > 0)
                @foreach($surveyReport->jenis_hama as $hama)
                    <span class="hama-tag">{{ $hama }}</span>
                @endforeach
            @else
                <p>-</p>
            @endif
        </div>

        <div class="section-title">Area Survey</div>
        <div class="info-box">
            <p>{{ $surveyReport->area_survey ?? '-' }}</p>
        </div>

        <div class="section-title">Tingkat Risiko</div>
        @php
            $riskClass = 'risk-rendah';
            if ($surveyReport->tingkat_risiko === 'sedang') $riskClass = 'risk-sedang';
            if ($surveyReport->tingkat_risiko === 'tinggi') $riskClass = 'risk-tinggi';
            if ($surveyReport->tingkat_risiko === 'kritis') $riskClass = 'risk-kritis';
        @endphp
        <div class="risk-box {{ $riskClass }}">
            <div class="risk-label">{{ strtoupper($surveyReport->tingkat_risiko ?? '-') }}</div>
        </div>

        <div class="section-title">Temuan</div>
        <div class="info-box">
            <p>{{ $surveyReport->temuan ?? '-' }}</p>
        </div>

        <div class="section-title">Rekomendasi</div>
        <div class="info-box">
            <p>{{ $surveyReport->rekomendasi ?? '-' }}</p>
        </div>

        @if($surveyReport->catatan)
        <div class="section-title">Catatan</div>
        <div class="info-box">
            <p>{{ $surveyReport->catatan }}</p>
        </div>
        @endif

        @if($surveyReport->photos && $surveyReport->photos->count() > 0)
        <div class="section-title">Dokumentasi Foto</div>
        <div class="photo-grid">
            @foreach($surveyReport->photos->take(3) as $photo)
                <div class="col">
                    <div class="photo-placeholder">Foto: {{ $photo->keterangan ?? 'Dokumentasi' }}</div>
                </div>
            @endforeach
        </div>
        @endif

        <div class="signatures">
            <div class="sig-block">
                <div class="sig-line">Surveyor</div>
                <p style="font-size: 10px; margin-top: 5px;">{{ $surveyReport->technician->name ?? '-' }}</p>
            </div>
            <div class="sig-block">
                <div class="sig-line">Customer</div>
                <p style="font-size: 10px; margin-top: 5px;">{{ $surveyReport->customer->company_name ?? '-' }}</p>
            </div>
        </div>

        <div class="footer">
            <p>G-PEST &mdash; Pest Control & Fumigation Services | {{ $surveyReport->nomor_survey }}</p>
        </div>
    </div>
</body>
</html>
