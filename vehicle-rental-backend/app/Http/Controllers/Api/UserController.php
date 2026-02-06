<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load(['dokumenti', 'rezervacije']);

        return response()->json($user);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'ime' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:korisnici,email,' . $user->id,
            'telefon' => 'sometimes|string|max:20',
            'sifra' => 'sometimes|string|min:8|confirmed',
        ]);

        $data = [];
        if ($request->has('ime')) $data['ime'] = $request->ime;
        if ($request->has('email')) $data['email'] = $request->email;
        if ($request->has('telefon')) $data['telefon'] = $request->telefon;

        if ($request->has('sifra')) {
            $data['sifra'] = Hash::make($request->sifra);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profil uspešno ažuriran',
            'user' => $user,
        ]);
    }

    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('uloga')) {
            $query->where('uloga', $request->uloga);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('ime', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate(20);

        return response()->json($users);
    }

    /**
     * Create new user (Admin only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'ime' => 'required|string|max:255',
            'email' => 'required|email|unique:korisnici',
            'sifra' => 'required|string|min:8',
            'uloga' => 'required|in:KLIJENT,SLUZBENIK,ADMINISTRATOR',
            'filijalaId' => 'nullable|exists:filijale,id',
            'telefon' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'ime' => $request->ime,
            'email' => $request->email,
            'sifra' => Hash::make($request->sifra),
            'uloga' => $request->uloga,
            'filijalaId' => $request->filijalaId,
            'telefon' => $request->telefon,
        ]);

        return response()->json([
            'message' => 'Korisnik uspešno kreiran',
            'user' => $user,
        ], 201);
    }

    /**
     * Update user (Admin only)
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'ime' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:korisnici,email,' . $user->id,
                'uloga' => 'sometimes|in:KLIJENT,SLUZBENIK,ADMINISTRATOR',
                'filijalaId' => 'nullable|exists:filijale,id',
                'telefon' => 'nullable|string|max:20',
                'sifra' => 'nullable|string|min:8',
            ]);

            $data = [];
            
            if ($request->has('ime')) $data['ime'] = $request->ime;
            if ($request->has('email')) $data['email'] = $request->email;
            if ($request->has('uloga')) $data['uloga'] = $request->uloga;
            if ($request->has('telefon')) $data['telefon'] = $request->telefon;
            
            // Handle filijalaId - set to null if not SLUZBENIK
            if ($request->has('filijalaId')) {
                $data['filijalaId'] = $request->filijalaId ?: null;
            }
            
            // Only hash password if provided
            if ($request->filled('sifra')) {
                $data['sifra'] = Hash::make($request->sifra);
            }

            $user->update($data);

            return response()->json([
                'message' => 'Korisnik uspešno ažuriran',
                'user' => $user->fresh(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Greška u validaciji podataka',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Greška pri ažuriranju korisnika: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Ne možete obrisati sopstveni nalog.'], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'Korisnik uspešno deaktiviran',
        ]);
    }
}
