<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zalba extends Model
{
    use HasFactory;

    protected $table = 'zalbe';

    protected $fillable = [
        'korisnikId',
        'rezervacijaId',
        'naslov',
        'sadrzaj',
        'status',
        'resenje',
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnikId');
    }

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacijaId');
    }
}
