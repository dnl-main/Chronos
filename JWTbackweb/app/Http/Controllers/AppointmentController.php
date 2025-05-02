<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $user = JWTAuth::user();
        $appointment = Appointment::where('user_id', $user->id)->first();
        return response()->json($appointment ?: [], 200);
    }

    public function store(Request $request)
    {
        $user = JWTAuth::user();
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        // Delete existing appointment to ensure one per user
        Appointment::where('user_id', $user->id)->delete();

        $appointment = Appointment::create([
            'user_id' => $user->id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json($appointment, 201);
    }

    public function show($id)
    {
        // Not needed for single appointment per user
        return response()->json(['message' => 'Method not implemented'], 501);
    }

    public function update(Request $request, $id)
    {
        // Not needed for single appointment per user
        return response()->json(['message' => 'Method not implemented'], 501);
    }

    public function destroy()
    {
        $user = JWTAuth::user();
        $deleted = Appointment::where('user_id', $user->id)->delete();
        return response()->json(['message' => $deleted ? 'Appointment deleted' : 'No appointment found'], 200);
    }
}