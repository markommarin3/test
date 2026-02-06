<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IzvestajOSteti extends Model
{
    use HasFactory;
    protected $table = 'izvestaji_o_steti';
    protected $fillable = ['rezervacijaId', 'opisStete', 'dodatniTrosak'];
    protected $casts = ['vremeKreiranja' => 'datetime', 'dodatniTrosak' => 'decimal:2'];

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacijaId');
    }
}
