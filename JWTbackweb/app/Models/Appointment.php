<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 
    'date', 
    'start_time', 
    'end_time',
    'department',
        'crewing_dept',
        'operator',
        'accounting_task',
        'employee',];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}