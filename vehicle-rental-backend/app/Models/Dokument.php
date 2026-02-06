<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dokument extends Model
{
    use HasFactory;

    protected $table = 'dokumenti';

    protected $fillable = [
        'korisnikId',
        'naziv',
        'putanja',
        'tip',
        'verifikovan',
        'status',
    ];

    protected $casts = [
        'verifikovan' => 'boolean',
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class, 'korisnikId');
    }
}
