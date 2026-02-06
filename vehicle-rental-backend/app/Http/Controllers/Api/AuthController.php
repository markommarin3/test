<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Registracija novog korisnika
     */
    public function register(Request $request)
    {
        $request->validate([
            'ime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:korisnici',
            'sifra' => 'required|string|min:8|confirmed',
            'telefon' => 'required|string|max:20',
        ]);

        $user = User::create([
            'ime' => $request->ime,
            'email' => $request->email,
            'sifra' => Hash::make($request->sifra),
            'telefon' => $request->telefon,
            'uloga' => 'KLIJENT',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Korisnik uspešno registrovan',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Prijava korisnika
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'sifra' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->sifra, $user->getAuthPassword())) {
            throw ValidationException::withMessages([
                'email' => ['Podaci za prijavu nisu ispravni.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Prijava uspešna',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Odjava korisnika
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Uspešno ste se odjavili',
        ]);
    }

    /**
     * Preuzimanje podataka o ulogovanom korisniku
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
