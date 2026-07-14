<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExportRequest;
use App\Services\ExportService;
use App\Traits\ApiResponse;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ExportService $exportService,
    ) {}

    public function export(ExportRequest $request)
    {
        $result = $this->exportService->export(
            $request->validated(),
            $request->user() ?? null
        );

        return Excel::download($result['export'], $result['fileName'], null, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Access-Control-Expose-Headers' => 'Content-Disposition',
        ]);
    }
}
