<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

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
                    'department' => $appointment->department,
                    'crewing_dept' => $appointment->crewing_dept,
                    'operator' => $appointment->operator,
                    'accounting_task' => $appointment->accounting_task,
                    'employee' => $appointment->employee,
                    'purpose' => $appointment->purpose,
                    'status' => $appointment->status,
                    'computed_status' => $this->getAppointmentStatus($appointment),
                    'user' => $appointment->user ? [
                        'first_name' => $appointment->user->first_name,
                        'middle_name' => $appointment->user->middle_name,
                        'last_name' => $appointment->user->last_name,
                        'email' => $appointment->user->email,
                        'mobile' => $appointment->user->mobile,
                        'position' => $appointment->user->position,
                        'department' => $appointment->user->department,
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
                'department' => $appointment->department,
                'crewing_dept' => $appointment->crewing_dept,
                'operator' => $appointment->operator,
                'accounting_task' => $appointment->accounting_task,
                'employee' => $appointment->employee,
                'purpose' => $appointment->purpose,
                'status' => $appointment->status,
                'computed_status' => $this->getAppointmentStatus($appointment),
                'user' => [
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'mobile' => $user->mobile,
                    'position' => $user->position,
                    'department' => $user->department,
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
        $appointmentDate = Carbon::parse($appointment->date)->startOfDay();

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
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'department' => 'required|in:crewing,medical,accounting',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        if ($user->role !== 'admin' && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot book for another user'], 403);
        }

        Appointment::where('user_id', $validated['user_id'])->delete();

        $appointment = Appointment::create([
            'user_id' => $validated['user_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'department' => $validated['department'],
            'crewing_dept' => $validated['crewing_dept'] ?? null,
            'operator' => $validated['operator'] ?? null,
            'accounting_task' => $validated['accounting_task'] ?? null,
            'employee' => $validated['employee_name'],
            'purpose' => $validated['purpose'],
            'status' => 'booked',
        ]);

        return response()->json([
            'appointment' => [
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'department' => $appointment->department,
                'crewing_dept' => $appointment->crewing_dept,
                'operator' => $appointment->operator,
                'accounting_task' => $appointment->accounting_task,
                'employee' => $appointment->employee,
                'purpose' => $appointment->purpose,
                'status' => $appointment->status,
                'computed_status' => $this->getAppointmentStatus($appointment),
            ]
        ], 201);
    }

    public function show($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        return response()->json([
            'id' => $appointment->id,
            'user_id' => $appointment->user_id,
            'date' => $appointment->date,
            'start_time' => $appointment->start_time,
            'end_time' => $appointment->end_time,
            'department' => $appointment->department,
            'crewing_dept' => $appointment->crewing_dept,
            'operator' => $appointment->operator,
            'accounting_task' => $appointment->accounting_task,
            'employee' => $appointment->employee,
            'purpose' => $appointment->purpose,
            'status' => $appointment->status,
            'computed_status' => $this->getAppointmentStatus($appointment),
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $user = JWTAuth::user();

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'department' => 'required|in:crewing,medical,accounting',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        $appointment->update([
            'user_id' => $validated['user_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'department' => $validated['department'],
            'crewing_dept' => $validated['crewing_dept'] ?? null,
            'operator' => $validated['operator'] ?? null,
            'accounting_task' => $validated['accounting_task'] ?? null,
            'employee' => $validated['employee_name'],
            'purpose' => $validated['purpose'],
            'status' => 'booked',
        ]);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => [
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'department' => $appointment->department,
                'crewing_dept' => $appointment->crewing_dept,
                'operator' => $appointment->operator,
                'accounting_task' => $appointment->accounting_task,
                'employee' => $appointment->employee,
                'purpose' => $appointment->purpose,
                'status' => $appointment->status,
                'computed_status' => $this->getAppointmentStatus($appointment),
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

    public function reschedule(Request $request, $id)
    {
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if (!$appointment->date || $this->getAppointmentStatus($appointment) === 'completed') {
            return response()->json(['message' => 'Only upcoming or today\'s appointments can be rescheduled'], 400);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'department' => 'required|in:crewing,medical,accounting',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'sometimes|string|max:255', // Changed to optional
        ]);

        $appointment->update([
            'user_id' => $validated['user_id'] ?? $appointment->user_id,
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'department' => $validated['department'],
            'crewing_dept' => $validated['crewing_dept'] ?? null,
            'operator' => $validated['operator'] ?? null,
            'accounting_task' => $validated['accounting_task'] ?? null,
            'employee' => $validated['employee_name'],
            'purpose' => $validated['purpose'] ?? $appointment->purpose, // Preserve existing purpose
            'status' => 'booked',
        ]);

        // Fetch the user associated with the appointment
        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            // Send email notification
            Mail::raw(
                "Your appointment has been rescheduled.\n\nYour new scheduled date is: {$appointment->date}\n\nPlease visit your account for more details.",
                function ($message) use ($recipient, $appointment) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Rescheduled');
                }
            );
        }

        return response()->json([
            'message' => 'Appointment rescheduled successfully',
            'appointment' => [
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'department' => $appointment->department,
                'crewing_dept' => $appointment->crewing_dept,
                'operator' => $appointment->operator,
                'accounting_task' => $appointment->accounting_task,
                'employee' => $appointment->employee,
                'purpose' => $appointment->purpose,
                'status' => $appointment->status,
                'computed_status' => $this->getAppointmentStatus($appointment),
            ],
        ], 200);
    }

    public function cancel($id)
    {
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if (!$appointment->date || $this->getAppointmentStatus($appointment) === 'completed') {
            return response()->json(['message' => 'Only upcoming or today\'s appointments can be canceled'], 400);
        }

        // Store appointment date before deletion
        $appointmentDate = $appointment->date;
        $recipient = User::find($appointment->user_id);

        $appointment->delete();

        // Send email notification if user exists and has an email
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment scheduled for {$appointmentDate} has been canceled.\n\nPlease visit your account for more details.",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Canceled');
                }
            );
        }

        return response()->json(['message' => 'Appointment canceled successfully'], 200);
    }
    public function getUpcomingAppointments()
    {
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->startOfDay();
        $appointments = Appointment::with('user')
            ->where('date', '>=', $today)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'user_id' => $appointment->user_id,
                    'date' => $appointment->date,
                    'start_time' => $appointment->start_time,
                    'end_time' => $appointment->end_time,
                    'department' => $appointment->department,
                    'crewing_dept' => $appointment->crewing_dept,
                    'operator' => $appointment->operator,
                    'accounting_task' => $appointment->accounting_task,
                    'employee' => $appointment->employee,
                    'purpose' => $appointment->purpose,
                    'status' => $appointment->status,
                    'computed_status' => $this->getAppointmentStatus($appointment),
                    'user' => $appointment->user ? [
                        'first_name' => $appointment->user->first_name,
                        'middle_name' => $appointment->user->middle_name,
                        'last_name' => $appointment->user->last_name,
                        'email' => $appointment->user->email,
                        'mobile' => $appointment->user->mobile,
                        'position' => $appointment->user->position,
                        'department' => $appointment->user->department,
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

    public function book(Request $request)
    {
        $user = JWTAuth::user();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'department' => 'required|in:crewing,medical,accounting',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        if ($user->role !== 'admin' && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot book for another user'], 403);
        }

        Appointment::where('user_id', $validated['user_id'])->delete();

        $appointment = Appointment::create([
            'user_id' => $validated['user_id'],
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'department' => $validated['department'],
            'crewing_dept' => $validated['crewing_dept'] ?? null,
            'operator' => $validated['operator'] ?? null,
            'accounting_task' => $validated['accounting_task'] ?? null,
            'employee' => $validated['employee_name'],
            'purpose' => $validated['purpose'],
            'status' => 'booked',
        ]);

        // Fetch the user associated with the appointment
        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            // Send email notification
            Mail::raw(
                "You have an appointment scheduled at {$appointment->date}.\n\nPlease visit your account for more details.",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Scheduled');
                }
            );
        }

        return response()->json([
            'appointment' => [
                'id' => $appointment->id,
                'user_id' => $appointment->user_id,
                'date' => $appointment->date,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'department' => $appointment->department,
                'crewing_dept' => $appointment->crewing_dept,
                'operator' => $appointment->operator,
                'accounting_task' => $appointment->accounting_task,
                'employee' => $appointment->employee,
                'purpose' => $appointment->purpose,
                'status' => $appointment->status,
                'computed_status' => $this->getAppointmentStatus($appointment),
            ]
        ], 201);
    }

}