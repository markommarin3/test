<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vozilo;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * Prikaz liste svih vozila
     */
    public function index(Request $request)
    {
        $query = Vozilo::with(['filijala', 'kategorija']);

        if ($request->has('kategorijaId')) {
            $query->where('kategorijaId', $request->kategorijaId);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->available();
        }

        if ($request->has('filijalaId')) {
            $query->where('filijalaId', $request->filijalaId);
        }

        $vehicles = $query->paginate(12);

        return response()->json($vehicles);
    }

    /**
     * Prikaz detalja jednog vozila
     */
    public function show($id)
    {
        $vehicle = Vozilo::with(['filijala', 'kategorija', 'reviews.korisnik'])->findOrFail($id);

        return response()->json($vehicle);
    }

    /**
     * Čuvanje novog vozila (Samo Administrator i Službenik)
     */
    public function store(Request $request)
    {
        $request->validate([
            'filijalaId' => 'required|exists:filijale,id',
            'kategorijaId' => 'required|exists:kategorije_vozila,id',
            'marka' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'registracioniBroj' => 'required|string|unique:vozila',
            'cenaPoDanu' => 'required|numeric|min:0',
            'godiste' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'gorivo' => 'required|string',
            'menjac' => 'required|string',
            'sedista' => 'required|integer|min:2|max:50',
            'image_url' => 'nullable|url',
        ]);

        $vehicle = Vozilo::create([
            'filijalaId' => $request->filijalaId,
            'kategorijaId' => $request->kategorijaId,
            'marka' => $request->marka,
            'model' => $request->model,
            'registracioniBroj' => $request->registracioniBroj,
            'cenaPoDanu' => $request->cenaPoDanu,
            'status' => 'DOSTUPNO',
            'godiste' => $request->godiste,
            'gorivo' => $request->gorivo,
            'menjac' => $request->menjac,
            'sedista' => $request->sedista,
            'image_url' => $request->image_url,
        ]);

        return response()->json([
            'message' => 'Vozilo uspešno dodato',
            'vehicle' => $vehicle,
        ], 201);
    }

    /**
     * Ažuriranje podataka o vozilu
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vozilo::findOrFail($id);

        $request->validate([
            'filijalaId' => 'sometimes|exists:filijale,id',
            'kategorijaId' => 'sometimes|exists:kategorije_vozila,id',
            'registracioniBroj' => 'sometimes|string|unique:vozila,registracioniBroj,' . $id,
            'status' => 'sometimes|in:DOSTUPNO,U_NAJMU,SERVIS,NEAKTIVNO',
            'cenaPoDanu' => 'sometimes|numeric|min:0',
        ]);

        // Autorizacija se vrši putem middleware-a u api.php

        $vehicle->update($request->all());

        return response()->json([
            'message' => 'Podaci o vozilu uspešno ažurirani',
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Brisanje vozila
     */
    public function destroy($id)
    {
        $vehicle = Vozilo::findOrFail($id);
        $vehicle->delete();

        return response()->json([
            'message' => 'Vozilo uspešno obrisano',
        ]);
    }
}
