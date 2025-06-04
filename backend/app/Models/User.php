<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Notifications\CustomResetPassword;
class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name', 'middle_name', 'last_name', 'email', 'mobile', 'password',
        'region', 'province', 'barangay', 'city', 'street', 'zip_code', 'building_number',
        'birthday', 'position', 'department', 'gender', 'civil_status', 'role', 'availability',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the JWT payload.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Returns the primary key of the user 
    }

    /**
     * Return the custom claims array for the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
public function sendPasswordResetNotification($token)
{
    $this->notify(new CustomResetPassword($token));
}
}


