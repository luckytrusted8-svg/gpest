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
        .header-right .doc-title { font-size: 24px; font-weight: bold; color: #0070f3; text-transform: uppercase; letter-spacing: 2px; }
        .meta-table { width: 100%; margin-bottom: 25px; }
        .meta-table td { padding: 4px 0; vertical-align: top; }
        .meta-label { font-weight: bold; width: 120px; color: #666; font-size: 10px; text-transform: uppercase; }
        .meta-value { font-size: 11px; }
        .section-title { font-size: 12px; font-weight: bold; color: #0070f3; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e0e0e0; }
        .info-box { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-bottom: 25px; }
        .info-box p { margin-bottom: 3px; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items th { background: #0070f3; color: white; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; }
        table.items th:last-child, table.items td:last-child { text-align: right; }
        table.items th:nth-child(4), table.items td:nth-child(4),
        table.items th:nth-child(5), table.items td:nth-child(5),
        table.items th:nth-child(6), table.items td:nth-child(6),
        table.items th:nth-child(7), table.items td:nth-child(7) { text-align: right; }
        table.items td { padding: 8px 10px; border-bottom: 1px solid #e0e0e0; font-size: 10.5px; }
        table.items tr:nth-child(even) { background: #f8f9fa; }
        .totals { width: 300px; margin-left: auto; margin-top: 10px; }
        .totals table { width: 100%; }
        .totals td { padding: 5px 10px; font-size: 11px; }
        .totals .label { text-align: right; font-weight: bold; color: #666; }
        .totals .value { text-align: right; }
        .totals .grand-total td { border-top: 2px solid #0070f3; font-size: 14px; font-weight: bold; color: #0070f3; padding-top: 8px; }
        .terms { margin-top: 30px; }
        .terms p { margin-bottom: 5px; white-space: pre-line; font-size: 10px; color: #444; }
        .signature { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig-block { width: 200px; text-align: center; }
        .sig-line { border-top: 1px solid #1a1a2e; margin-top: 50px; padding-top: 5px; font-size: 10px; }
        .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; }
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
                <div class="doc-title">Penawaran</div>
                <p style="font-size: 11px; color: #666; margin-top: 5px;">{{ $quotation->nomor_quotation }}</p>
            </div>
        </div>

        <table class="meta-table">
            <tr>
                <td class="meta-label">Nomor</td>
                <td class="meta-value">{{ $quotation->nomor_quotation }}</td>
                <td class="meta-label">Dibuat Oleh</td>
                <td class="meta-value">{{ $quotation->creator->name }}</td>
            </tr>
            <tr>
                <td class="meta-label">Tanggal</td>
                <td class="meta-value">{{ $quotation->created_at->format('d/m/Y') }}</td>
                <td class="meta-label">Berlaku Hingga</td>
                <td class="meta-value">{{ $quotation->berlaku_hingga->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="meta-label">Status</td>
                <td class="meta-value" style="text-transform: uppercase; font-weight: bold;">{{ $quotation->status }}</td>
                <td></td>
                <td></td>
            </tr>
        </table>

        <div class="section-title">Kepada Yth.</div>
        <div class="info-box">
            <p style="font-weight: bold; font-size: 13px;">{{ $quotation->customer->company_name }}</p>
            @if($quotation->customer->address)
                <p>{{ $quotation->customer->address }}</p>
            @endif
            @if($quotation->customer->contact_person)
                <p>Attention: {{ $quotation->customer->contact_person }}</p>
            @endif
            @if($quotation->customer->phone)
                <p>Telp: {{ $quotation->customer->phone }}</p>
            @endif
            @if($quotation->customer->email)
                <p>Email: {{ $quotation->customer->email }}</p>
            @endif
        </div>

        <div class="section-title">Rincian Layanan</div>
        <table class="items">
            <thead>
                <tr>
                    <th style="width: 30px;">No</th>
                    <th>Jenis Layanan</th>
                    <th>Deskripsi</th>
                    <th style="width: 60px;">Qty</th>
                    <th style="width: 60px;">Satuan</th>
                    <th style="width: 90px;">Harga Satuan</th>
                    <th style="width: 50px;">Diskon %</th>
                    <th style="width: 100px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($quotation->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->jenis_layanan }}</td>
                    <td>{{ $item->deskripsi ?? '-' }}</td>
                    <td style="text-align: right;">{{ number_format($item->kuantitas, 0, ',', '.') }}</td>
                    <td>{{ $item->satuan }}</td>
                    <td style="text-align: right;">Rp {{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                    <td style="text-align: right;">{{ $item->diskon_persen }}%</td>
                    <td style="text-align: right; font-weight: bold;">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <table>
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="value">Rp {{ number_format($quotation->items->sum(function($i) { return $i->kuantitas * $i->harga_satuan; }), 0, ',', '.') }}</td>
                </tr>
                @if($quotation->items->sum('diskon_persen') > 0)
                <tr>
                    <td class="label">Total Diskon</td>
                    <td class="value" style="color: #ee0000;">- Rp {{ number_format($quotation->items->sum(function($i) { return ($i->kuantitas * $i->harga_satuan) - $i->subtotal; }), 0, ',', '.') }}</td>
                </tr>
                @endif
                <tr class="grand-total">
                    <td class="label">TOTAL</td>
                    <td class="value">Rp {{ number_format($quotation->total, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        @if($quotation->syarat_ketentuan)
        <div class="terms">
            <div class="section-title">Syarat & Ketentuan</div>
            <p>{!! nl2br(e($quotation->syarat_ketentuan)) !!}</p>
        </div>
        @endif

        <div class="signature">
            <div class="sig-block">
                <div class="sig-line">Hormat Kami,</div>
                <p style="font-size: 10px; margin-top: 5px;">G-PEST</p>
            </div>
            <div class="sig-block">
                <div class="sig-line">Penerima,</div>
                <p style="font-size: 10px; margin-top: 5px;">{{ $quotation->customer->company_name }}</p>
            </div>
        </div>

        <div class="footer">
            <p>G-PEST &mdash; Pest Control & Fumigation Services | {{ $quotation->nomor_quotation }}</p>
        </div>
    </div>
</body>
</html>
