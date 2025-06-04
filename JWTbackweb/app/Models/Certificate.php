<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'certificate_name',
        'certificate_type',
        'file_path',
        'user_id',
        'expiration_date',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}