<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\User;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    /**
     * Get system statistics (Admin only)
     */
    public function index()
    {
        return response()->json([
            'total_vehicles' => Vehicle::count(),
            'total_users' => User::count(),
            'total_reservations' => Reservation::count(),
            'total_revenue' => (float) Reservation::where('status', '!=', 'OTKAZANA')->sum('ukupnaCena'),
            'vehicles_by_status' => Vehicle::select('status', DB::raw('count(*) as total'))->groupBy('status')->get(),
            'latest_reservations' => Reservation::with(['korisnik', 'vozilo'])->latest()->take(5)->get(),
        ]);
    }
}
