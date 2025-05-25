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
                        'gender' => $appointment->user->gender,
                        'civil_status' => $appointment->user->civil_status,
                        'birthday' => $appointment->user->birthday,
                        'address' => $this->formatAddress($appointment->user),
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
                    'secondary_position' => $user->secondary_position,
                    'availability' => $user->availability,
                    'gender' => $user->gender,
                    'civil_status' => $user->civil_status,
                    'birthday' => $user->birthday,
                    'address' => $this->formatAddress($user),
                ],
            ], 200);
        }

        return response()->json([], 200);
    }

    private function formatAddress($user)
    {
        $addressParts = array_filter([
            $user->building_number,
            $user->street,
            $user->barangay,
            $user->city,
            $user->province,
            $user->region,
            $user->zip_code,
        ]);

        return !empty($addressParts) ? implode(', ', $addressParts) : null;
    }

    public function getTodayCount()
    {
        $today = Carbon::today()->toDateString();
        $count = Appointment::where('date', $today)->count();
        return response()->json(['count' => $count], 200);
    }

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
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $appointment->update([
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => [
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'status' => $this->getAppointmentStatus($appointment),
            ],
        ], 200);
    }

    public function destroy()
    {
        $user = JWTAuth::user();
        $deleted = Appointment::where('user_id', $user->id)->delete();
        return response()->json(['message' => $deleted ? 'Appointment deleted' : 'No appointment found'], 200);
    }

    public function delete($id)
    {
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted successfully'], 200);
    }
}