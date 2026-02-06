<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategorijaVozila extends Model
{
    use HasFactory;
    protected $table = 'kategorije_vozila';
    protected $fillable = ['naziv', 'cenaPoDanu'];
}
