<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use App\Models\SurveyReport;
use App\Models\WorkReport;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function workReport(WorkReport $workReport)
    {
        $workReport->load(['customer', 'contract', 'technician', 'photos']);

        $pdf = Pdf::loadView('pdf.work-report', ['workReport' => $workReport]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("laporan-kerja-{$workReport->nomor_laporan}.pdf");
    }

    public function surveyReport(SurveyReport $surveyReport)
    {
        $surveyReport->load(['customer', 'contract', 'technician', 'photos']);

        $pdf = Pdf::loadView('pdf.survey-report', ['surveyReport' => $surveyReport]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("laporan-survey-{$surveyReport->nomor_survey}.pdf");
    }

    public function quotation(Quotation $quotation)
    {
        $quotation->load(['customer', 'creator', 'items']);

        $pdf = Pdf::loadView('pdf.quotation', ['quotation' => $quotation]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download("quotation-{$quotation->nomor_quotation}.pdf");
    }
}
