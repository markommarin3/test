<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vozilo;
use App\Models\KategorijaVozila;
use App\Models\Filijala;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Kreiranje Ekspozitura (Branches)
        $branchBG = Filijala::firstOrCreate(['name' => 'Beograd Centar'], [
            'address' => 'Knez Mihailova 1',
            'city' => 'Beograd',
            'phone' => '+381 11 1234567',
        ]);

        $branchNS = Filijala::firstOrCreate(['name' => 'Novi Sad - Aerodrom'], [
            'address' => 'Put Avijatičara 10',
            'city' => 'Novi Sad',
            'phone' => '+381 21 7654321',
        ]);

        // 2. Kreiranje Kategorija
        $catEconomy = KategorijaVozila::firstOrCreate(['name' => 'Ekonomična'], [
            'description' => 'Mali gradski automobili, mala potrošnja.',
            'daily_price' => 25.00,
        ]);

        $catLuxury = KategorijaVozila::firstOrCreate(['name' => 'Luksuzna'], [
            'description' => 'Premium limuzine za maksimalan komfor.',
            'daily_price' => 85.00,
        ]);

        $catSUV = KategorijaVozila::firstOrCreate(['name' => 'SUV'], [
            'description' => 'Snažna vozila za sve terene i porodična putovanja.',
            'daily_price' => 55.00,
        ]);

        // 3. Kreiranje Vozila
        Vozilo::create([
            'brand' => 'Volkswagen',
            'model' => 'Golf 8',
            'registration' => 'BG-123-AA',
            'year' => 2023,
            'color' => 'Siva',
            'fuel_type' => 'dizel',
            'transmission' => 'automatski',
            'seats' => 5,
            'image_url' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
            'status' => 'dostupno',
            'category_id' => $catEconomy->id,
            'branch_id' => $branchBG->id,
        ]);

        Vozilo::create([
            'brand' => 'BMW',
            'model' => 'Serija 5',
            'registration' => 'BG-999-BB',
            'year' => 2022,
            'color' => 'Crna',
            'fuel_type' => 'benzin',
            'transmission' => 'automatski',
            'seats' => 5,
            'image_url' => 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
            'status' => 'dostupno',
            'category_id' => $catLuxury->id,
            'branch_id' => $branchBG->id,
        ]);

        Vozilo::create([
            'brand' => 'Audi',
            'model' => 'Q7',
            'registration' => 'NS-444-CC',
            'year' => 2023,
            'color' => 'Bela',
            'fuel_type' => 'dizel',
            'transmission' => 'automatski',
            'seats' => 7,
            'image_url' => 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=800&q=80',
            'status' => 'dostupno',
            'category_id' => $catSUV->id,
            'branch_id' => $branchNS->id,
        ]);

        Vozilo::create([
            'brand' => 'Toyota',
            'model' => 'Yaris',
            'registration' => 'NS-555-DD',
            'year' => 2021,
            'color' => 'Crvena',
            'fuel_type' => 'hibrid',
            'transmission' => 'automatski',
            'seats' => 5,
            'image_url' => 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
            'status' => 'dostupno',
            'category_id' => $catEconomy->id,
            'branch_id' => $branchNS->id,
        ]);
    }
}
