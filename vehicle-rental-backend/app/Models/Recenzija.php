<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recenzija extends Model
{
    use HasFactory;

    protected $table = 'recenzije';

    protected $fillable = [
        'korisnikId',
        'voziloId',
        'rezervacijaId',
        'ocena',
        'komentar',
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnikId');
    }

    public function vozilo()
    {
        return $this->belongsTo(Vozilo::class, 'voziloId');
    }

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacijaId');
    }
}
