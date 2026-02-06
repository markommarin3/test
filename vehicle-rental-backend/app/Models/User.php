<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $table = 'korisnici';

    protected $fillable = [
        'ime',
        'email',
        'sifra',
        'uloga',
        'telefon',
        'filijalaId',
    ];

    protected $hidden = [
        'sifra',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'vremeRegistracije' => 'datetime',
            'sifra' => 'hashed',
        ];
    }

    // Auth needs to know the password field name
    public function getAuthPassword()
    {
        return $this->sifra;
    }

    // Relationships
    public function filijala()
    {
        return $this->belongsTo(Filijala::class, 'filijalaId');
    }

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'korisnikId');
    }

    public function dokumenti()
    {
        return $this->hasMany(Dokument::class, 'korisnikId');
    }

    public function recenzije()
    {
        return $this->hasMany(Recenzija::class, 'korisnikId');
    }

    public function zalbe()
    {
        return $this->hasMany(Zalba::class, 'korisnikId');
    }

    // Scopes
    public function scopeByRole($query, $role)
    {
        return $query->where('uloga', $role);
    }
}
