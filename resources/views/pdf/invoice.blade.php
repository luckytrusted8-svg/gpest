<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->nomor_invoice }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-bottom: 20px; }
        .company { font-size: 18px; font-weight: bold; color: #0070f3; }
        .invoice-title { text-align: right; font-size: 20px; font-weight: bold; text-transform: uppercase; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f5f5f5; font-weight: bold; }
        .total-box { float: right; width: 250px; margin-top: 10px; }
        .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .grand-total { font-size: 14px; font-weight: bold; color: #0070f3; border-top: 1px solid #333; padding-top: 5px; }
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <img src="{{ public_path('images/logo.png') }}" style="height: 42px; width: auto; margin-bottom: 5px;" alt="G-PEST Logo">
                    <div>Pest Control & Fumigation Services</div>
                    <div>Jl. Contoh No. 123, Jakarta Selatan</div>
                    <div>Telp: (021) 1234-5678 | Email: info@gpest.id</div>
                </td>
                <td class="invoice-title">
                    INVOICE
                    <div style="font-size: 14px; color: #555; font-weight: normal; margin-top: 5px;">{{ $invoice->nomor_invoice }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="info-table">
        <tr>
            <td style="width: 50%;">
                <strong>TAGIHAN KEPADA:</strong><br>
                {{ $invoice->customer->company_name ?? '-' }}<br>
                {{ $invoice->customer->address ?? '' }}<br>
                Telp: {{ $invoice->customer->phone ?? '-' }}<br>
                Email: {{ $invoice->customer->email ?? '-' }}
            </td>
            <td style="width: 50%; text-align: right;">
                <strong>DETAIL INVOICE:</strong><br>
                Tanggal Invoice: {{ date('d/m/Y', strtotime($invoice->tanggal_invoice)) }}<br>
                Jatuh Tempo: {{ date('d/m/Y', strtotime($invoice->jatuh_tempo)) }}<br>
                Status Pembayaran: <strong>{{ strtoupper(str_replace('_', ' ', $invoice->status_pembayaran)) }}</strong>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Deskripsi Layanan</th>
                <th style="text-align: right;">Qty</th>
                <th style="text-align: right;">Harga Satuan</th>
                <th style="text-align: right;">Diskon (%)</th>
                <th style="text-align: right;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $idx => $item)
                <tr>
                    <td>{{ $idx + 1 }}</td>
                    <td>{{ $item->deskripsi }}</td>
                    <td style="text-align: right;">{{ $item->kuantitas }} {{ $item->satuan }}</td>
                    <td style="text-align: right;">Rp {{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                    <td style="text-align: right;">{{ $item->diskon_persen }}%</td>
                    <td style="text-align: right;">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="width: 100%; clear: both;">
        <div style="float: right; width: 250px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0;">Subtotal:</td>
                    <td style="text-align: right; padding: 4px 0;">Rp {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
                <tr style="font-weight: bold; border-top: 1px solid #ccc;">
                    <td style="padding: 6px 0;">Total Tagihan:</td>
                    <td style="text-align: right; padding: 6px 0; color: #0070f3;">Rp {{ number_format($invoice->total, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div style="clear: both; margin-top: 40px;">
        <strong>Catatan & Instruksi Pembayaran:</strong><br>
        <p style="margin-top: 5px; color: #555;">
            {{ $invoice->catatan ?? 'Silakan lakukan pembayaran ke rekening Bank BCA 123-456-7890 a.n PT G-PEST Indonesia sebelum tanggal jatuh tempo.' }}
        </p>
    </div>

    <div class="footer">
        Terima kasih atas kerja sama Anda dengan G-PEST.
    </div>
</body>
</html>
