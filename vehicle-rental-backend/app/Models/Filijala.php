<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filijala extends Model
{
    use HasFactory;
    protected $table = 'filijale';
    protected $fillable = ['ime', 'adresa', 'grad'];
}
