<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $user = JWTAuth::user();

        if ($user->role === 'admin') {
            $appointments = Appointment::with('user')->get()->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'user_id' => $appointment->user_id,
                    'date' => $appointment->date,
                    'start_time' => $appointment->start_time,
                    'end_time' => $appointment->end_time,
                    'status' => $this->getAppointmentStatus($appointment),
                    'user' => $appointment->user ? [
                        'first_name' => $appointment->user->first_name,
                        'middle_name' => $appointment->user->middle_name,
                        'last_name' => $appointment->user->last_name,
                        'email' => $appointment->user->email,
                        'mobile' => $appointment->user->mobile,
                        'position' => $appointment->user->position,
                        'secondary_position' => $appointment->user->secondary_position,
                        'availability' => $appointment->user->availability,
                    ] : null,
                ];
            });
            return response()->json($appointments, 200);
        }

        $appointment = Appointment::where('user_id', $user->id)->first();
        if ($appointment) {
            return response()->json([
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'status' => $this->getAppointmentStatus($appointment),
                'user' => [
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'mobile' => $user->mobile,
                    'position' => $user->position,
                ],
            ], 200);
        }

        return response()->json([], 200);
    }

    // New endpoint for today's appointment count
    public function getTodayCount()
    {
        $today = Carbon::today()->toDateString();
        $count = Appointment::where('date', $today)->count();
        return response()->json(['count' => $count], 200);
    }

    // New endpoint for upcoming appointment count
    public function getUpcomingCount()
    {
        $today = Carbon::today()->startOfDay();
        $count = Appointment::where('date', '>=', $today)->count();
        return response()->json(['count' => $count], 200);
    }

    private function getAppointmentStatus($appointment)
    {
        $today = now()->startOfDay();
        $appointmentDate = \Carbon\Carbon::parse($appointment->date)->startOfDay();

        if ($appointmentDate->isToday()) {
            return 'today';
        } elseif ($appointmentDate->isPast()) {
            return 'completed';
        } else {
            return 'upcoming';
        }
    }

    public function store(Request $request)
    {
        $user = JWTAuth::user();
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

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
        return response()->json(['message' => 'Method not implemented'], 501);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Method not implemented'], 501);
    }

    public function destroy()
    {
        $user = JWTAuth::user();
        $deleted = Appointment::where('user_id', $user->id)->delete();
        return response()->json(['message' => $deleted ? 'Appointment deleted' : 'No appointment found'], 200);
    }
}