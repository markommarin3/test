<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vozilo;
use App\Models\Rezervacija;
use App\Models\Filijala;
use App\Models\KategorijaVozila;
use App\Models\Placanje;
use App\Models\Recenzija;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Filijale
        $b1 = Filijala::create(['ime' => 'Beograd Centar', 'adresa' => 'Kneza Miloša 10', 'grad' => 'Beograd']);
        $b2 = Filijala::create(['ime' => 'Novi Sad - Aerodrom', 'adresa' => 'Bulevar Oslobođenja 5', 'grad' => 'Novi Sad']);
        $b3 = Filijala::create(['ime' => 'Niš Jug', 'adresa' => 'Vojvode Mišića 2', 'grad' => 'Niš']);

        // 2. Kategorije
        $c1 = KategorijaVozila::create(['naziv' => 'EKONOMI', 'cenaPoDanu' => 35.00]);
        $c2 = KategorijaVozila::create(['naziv' => 'SUV', 'cenaPoDanu' => 65.00]);
        $c3 = KategorijaVozila::create(['naziv' => 'LUKSUZ', 'cenaPoDanu' => 120.00]);

        // 3. Korisnici
        User::create([
            'ime' => 'Marko Admin',
            'email' => 'admin@iteh.rs',
            'sifra' => bcrypt('admin123'),
            'uloga' => 'ADMINISTRATOR',
            'telefon' => '0641234567',
        ]);

        User::create([
            'ime' => 'Luka Sluzbenik',
            'email' => 'sluzbenik@iteh.rs',
            'sifra' => bcrypt('sluzbenik123'),
            'uloga' => 'SLUZBENIK',
            'telefon' => '0647654321',
            'filijalaId' => $b2->id,
        ]);

        $klijent = User::create([
            'ime' => 'Petar Klijent',
            'email' => 'klijent@iteh.rs',
            'sifra' => bcrypt('klijent123'),
            'uloga' => 'KLIJENT',
            'telefon' => '062998877',
        ]);

        // 4. Vozila
        $v1 = Vozilo::create([
            'filijalaId' => $b1->id,
            'kategorijaId' => $c3->id,
            'marka' => 'BMW',
            'model' => 'Serija 5',
            'registracioniBroj' => 'BG-999-BB',
            'cenaPoDanu' => 120.00,
            'status' => 'DOSTUPNO',
            'image_url' => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
            'godiste' => 2022,
            'gorivo' => 'Dizel',
            'menjac' => 'Automatski',
            'sedista' => 5
        ]);

        $v2 = Vozilo::create([
            'filijalaId' => $b2->id,
            'kategorijaId' => $c1->id,
            'marka' => 'Volkswagen',
            'model' => 'Golf 8',
            'registracioniBroj' => 'NS-123-VV',
            'cenaPoDanu' => 45.00,
            'status' => 'DOSTUPNO',
            'image_url' => 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&q=80&w=800',
            'godiste' => 2021,
            'gorivo' => 'Benzin',
            'menjac' => 'Manuelni',
            'sedista' => 5
        ]);

        $v3 = Vozilo::create([
            'filijalaId' => $b1->id,
            'kategorijaId' => $c2->id,
            'marka' => 'Mercedes',
            'model' => 'GLC',
            'registracioniBroj' => 'BG-111-AA',
            'cenaPoDanu' => 85.00,
            'status' => 'DOSTUPNO',
            'image_url' => 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
            'godiste' => 2023,
            'gorivo' => 'Hibrid',
            'menjac' => 'Automatski',
            'sedista' => 5
        ]);

        $v4 = Vozilo::create([
            'filijalaId' => $b3->id,
            'kategorijaId' => $c3->id,
            'marka' => 'Audi',
            'model' => 'A6',
            'registracioniBroj' => 'NI-555-RR',
            'cenaPoDanu' => 110.00,
            'status' => 'DOSTUPNO',
            'image_url' => 'https://images.unsplash.com/photo-1603584173870-7f3ca93540d5?auto=format&fit=crop&q=80&w=800',
            'godiste' => 2022,
            'gorivo' => 'Dizel',
            'menjac' => 'Automatski',
            'sedista' => 5
        ]);

        $v5 = Vozilo::create([
            'filijalaId' => $b1->id,
            'kategorijaId' => $c1->id,
            'marka' => 'Fiat',
            'model' => '500',
            'registracioniBroj' => 'BG-222-CC',
            'cenaPoDanu' => 30.00,
            'status' => 'DOSTUPNO',
            'image_url' => 'https://images.unsplash.com/photo-1595180630321-7264a784400c?auto=format&fit=crop&q=80&w=800',
            'godiste' => 2020,
            'gorivo' => 'Električno',
            'menjac' => 'Automatski',
            'sedista' => 4
        ]);

        // 5. Test Rezervacije
        $res = Rezervacija::create([
            'korisnikId' => $klijent->id,
            'voziloId' => $v1->id,
            'filijalaPreuzimanjaId' => $b1->id,
            'filijalaVracanjaId' => $b1->id,
            'vremePreuzimanja' => now()->addDays(2),
            'vremeVracanja' => now()->addDays(5),
            'ukupnaCena' => 360.00,
            'status' => 'CEKA',
            'napomene' => 'Molim vas za čist auto.'
        ]);

        Placanje::create([
            'rezervacijaId' => $res->id,
            'iznos' => 360.00,
            'status' => 'CEKA'
        ]);

        // 6. Test Recenzije
        Recenzija::create([
            'korisnikId' => $klijent->id,
            'voziloId' => $v1->id,
            'ocena' => 5,
            'komentar' => 'Odličan auto, preporuka!'
        ]);

        Recenzija::create([
            'korisnikId' => $klijent->id,
            'voziloId' => $v2->id,
            'ocena' => 4,
            'komentar' => 'Malo manji, ali veoma udoban i štedljiv.'
        ]);
    }
}
