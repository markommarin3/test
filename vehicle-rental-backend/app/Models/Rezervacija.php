<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    use HasFactory;

    protected $table = 'rezervacije';

    protected $fillable = [
        'korisnikId',
        'voziloId',
        'filijalaPreuzimanjaId',
        'filijalaVracanjaId',
        'vremePreuzimanja',
        'vremeVracanja',
        'ukupnaCena',
        'kmPreuzimanje',
        'kmVracanje',
        'gorivoPreuzimanje',
        'gorivoVracanje',
        'status',
        'napomene',
    ];

    protected $casts = [
        'vremePreuzimanja' => 'datetime',
        'vremeVracanja' => 'datetime',
        'vremeKreiranja' => 'datetime',
        'ukupnaCena' => 'decimal:2',
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnikId');
    }

    public function vozilo()
    {
        return $this->belongsTo(Vozilo::class, 'voziloId');
    }

    public function filijalaPreuzimanja()
    {
        return $this->belongsTo(Filijala::class, 'filijalaPreuzimanjaId');
    }

    public function filijalaVracanja()
    {
        return $this->belongsTo(Filijala::class, 'filijalaVracanjaId');
    }

    public function placanje()
    {
        return $this->hasOne(Placanje::class, 'rezervacijaId');
    }

    public function izvestajiOSteti()
    {
        return $this->hasMany(IzvestajOSteti::class, 'rezervacijaId');
    }
}
