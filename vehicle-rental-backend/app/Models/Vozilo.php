<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vozilo extends Model
{
    use HasFactory;

    protected $table = 'vozila';

    protected $fillable = [
        'filijalaId',
        'kategorijaId',
        'marka',
        'model',
        'registracioniBroj',
        'cenaPoDanu',
        'status',
        'image_url',
        'godiste',
        'gorivo',
        'menjac',
        'sedista',
    ];

    public function filijala()
    {
        return $this->belongsTo(Filijala::class, 'filijalaId');
    }

    public function kategorija()
    {
        return $this->belongsTo(KategorijaVozila::class, 'kategorijaId');
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'voziloId');
    }

    public function reviews()
    {
        return $this->hasMany(Recenzija::class, 'voziloId');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'DOSTUPNO');
    }
}
