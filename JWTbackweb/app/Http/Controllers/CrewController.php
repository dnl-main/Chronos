<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CrewController extends Controller
{
    public function getCrewMembers()
    {
        // Ensure only admins can access this endpoint
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch users with 'user' role, including all columns
        $crewMembers = User::where('role', 'user')->get();

        return response()->json($crewMembers);
    }
}