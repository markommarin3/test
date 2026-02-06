<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DamageReport;
use App\Models\Reservation;
use Illuminate\Http\Request;

class DamageReportController extends Controller
{
    /**
     * Get damage reports for a reservation
     */
    public function index($reservationId)
    {
        $reports = DamageReport::where('rezervacijaId', $reservationId)->get();
        return response()->json($reports);
    }

    /**
     * Store a new damage report
     */
    public function store(Request $request)
    {
        $request->validate([
            'rezervacijaId' => 'required|exists:rezervacije,id',
            'opisStete' => 'required|string',
            'dodatniTrosak' => 'nullable|numeric|min:0',
        ]);

        $report = DamageReport::create([
            'rezervacijaId' => $request->rezervacijaId,
            'opisStete' => $request->opisStete,
            'dodatniTrosak' => $request->dodatniTrosak ?? 0,
        ]);

        return response()->json([
            'message' => 'Izveštaj o šteti uspešno kreiran',
            'report' => $report
        ], 201);
    }
}
