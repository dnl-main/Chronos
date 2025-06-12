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

        // Fetch users with 'user' role, including all columns
        $crewMembers = User::where('role', 'user')->get();

        return response()->json($crewMembers);
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