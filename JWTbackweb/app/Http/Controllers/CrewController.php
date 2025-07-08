<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CrewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

 public function getCrewMembers()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }


        $crewMembers = User::where('role', 'user')
            ->with('profilePicture')
            ->get()
            ->map(function ($user) {
                // Determine the profile picture URL
                $profilePicture = $user->profilePicture && $user->profilePicture->path
                    ? ($this->isUrl($user->profilePicture->path)
                        ? $user->profilePicture->path
                        : env('APP_URL') . '/storage/' . ltrim($user->profilePicture->path, '/'))
                    : null;

                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'position' => $user->position,
                    'availability' => $user->availability,
                    'department' => $user->department,
                    'mobile' => $user->mobile,
                    'profilePicture' => $profilePicture,
                    // Add other fields as needed
                ];
            });

        return response()->json($crewMembers);
    }
        private function isUrl($string)
    {
        return filter_var($string, FILTER_VALIDATE_URL) !== false;
    }


    public function getAvailableCrewCount()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Count available crew members
        $totalCount = User::where('role', 'user')
            ->where('availability', 'available') // Adjust based on actual field
            ->count();

        // Count crew members with complete profiles
        $completeCount = User::where('role', 'user')
            ->where('availability', 'available')
            ->whereNotNull('first_name')
            ->whereNotNull('last_name')
            ->whereNotNull('position')
            ->count();

        return response()->json([
            'total' => $totalCount,
            'complete' => $completeCount,
        ]);
    }

    public function getAdmin()
    {
                if (Auth::user()->role !== 'user') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $admins = User::where('role', 'admin')
            ->select('first_name', 'last_name', 'department')
            ->get();

        return response()->json($admins);
    }
    
    public function getCrewCerts()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch users with 'user' role, including certificates
        $users = User::where('role', 'user')
            ->with('certificates')
            ->get();

        $crewMembers = $users->map(function ($user) {
            $certificates = $user->certificates ?? collect([]);
            return [
                'user_id' => $user->id,
                'user_name' => trim($user->first_name . ' ' . 
                             ($user->middle_name ? $user->middle_name . ' ' : '') .
                             $user->last_name),
                'email' => $user->email, // Add email field
                'position' => $user->position ?? 'N/A',
                'total_uploaded' => $certificates->count(),
                'approved' => $certificates->where('status', 'approved')->count(),
                'pending' => $certificates->where('status', 'pending')->count(),
                'certificates' => $certificates->map(function ($cert) {
                    return [
                        'id' => $cert->id,
                        'certificate_name' => $cert->certificate_name,
                        'certificate_type' => $cert->certificate_type,
                        'file_path' => $cert->file_path,
                        'expiration_date' => $cert->expiration_date,
                        'status' => $cert->status ?? 'pending',
                    ];
                })->toArray(),
            ];
        })->filter(function ($member) {
            return $member['position'] !== 'Unregistered';
        })->values();

        return response()->json(['crew_members' => $crewMembers], 200);
    }


}