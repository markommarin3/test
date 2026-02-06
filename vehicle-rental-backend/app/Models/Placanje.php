<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Placanje extends Model
{
    use HasFactory;
    protected $table = 'placanja';
    protected $fillable = ['rezervacijaId', 'iznos', 'status', 'metodaPlacanja', 'providerRef', 'vremePlacanja'];
    protected $casts = ['vremePlacanja' => 'datetime', 'iznos' => 'decimal:2'];

    public function rezervacija()
    {
        return $this->belongsTo(Rezervacija::class, 'rezervacijaId');
    }
}
