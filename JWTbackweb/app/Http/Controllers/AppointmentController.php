<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AppointmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Check if a string is a valid URL
     */
    private function isUrl($string)
    {
        return filter_var($string, FILTER_VALIDATE_URL) !== false;
    }

    private function updatePastBookedAppointments()
    {
        $now = Carbon::now();
        $appointments = Appointment::where('status', 'booked')
            ->where('date', '<=', $now->toDateString())
            ->whereRaw("CONCAT(date, ' ', end_time) <= ?", [$now->toDateTimeString()])
            ->get();

        foreach ($appointments as $appointment) {
            $appointment->update(['status' => 'completed']);

            $recipient = User::find($appointment->user_id);
            if ($recipient && $recipient->email) {
                Mail::raw(
                    "Your appointment has been marked as completed.\n\n" .
                    "Details of your completed appointment:\n" .
                    "Date: {$appointment->date}\n" .
                    "Start Time: {$appointment->start_time}\n" .
                    "End Time: {$appointment->end_time}\n" .
                    "Department: {$appointment->department}\n" .
                    "Employee: {$appointment->employee}\n" .
                    "Purpose: {$appointment->purpose}\n" .
                    "If you have any questions, please contact us at: Concorde@fmssupport.com.ph\n\n",
                    function ($message) use ($recipient) {
                        $message->to($recipient->email)
                                ->subject('Your Appointment Has Been Completed');
                    }
                );
            }
        }
    }

    public function index()
    {
        $this->updatePastBookedAppointments();
        $user = JWTAuth::user();
        $today = Carbon::today()->startOfDay();

        if ($user->role === 'admin') {
            $appointments = Appointment::with(['user.profilePicture'])
                ->where('date', '>=', $today)
                ->orderBy('date', 'asc')
                ->get()
                ->map(function ($appointment) {
                    $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                        ? ($this->isUrl($appointment->user->profilePicture->path)
                            ? $appointment->user->profilePicture->path
                            : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                        : null;

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
                            'profilePicture' => $profilePicture,
                        ] : null,
                    ];
                });
            return response()->json($appointments, 200);
        }

        $appointment = Appointment::with(['user.profilePicture'])
            ->where('user_id', $user->id)
            ->where('date', '>=', $today)
            ->whereIn('status', ['booked', 'pending'])
            ->orderBy('date', 'asc')
            ->first();
        if ($appointment) {
            $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                ? ($this->isUrl($appointment->user->profilePicture->path)
                    ? $appointment->user->profilePicture->path
                    : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                : null;

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
                    'profilePicture' => $profilePicture,
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

    public function getTodayCount(Request $request)
    {
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->updatePastBookedAppointments();
        $employeeName = $user->first_name . ' ' . $user->last_name;
        $today = Carbon::today()->toDateString();

        $count = Appointment::where('employee', $employeeName)
            ->where('date', $today)
            ->where('status', 'booked')
            ->count();

        return response()->json(['count' => $count], 200);
    }

    public function getUpcomingCount(Request $request)
    {
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->updatePastBookedAppointments();
        $employeeName = $user->first_name . ' ' . $user->last_name;
        $today = Carbon::today()->startOfDay();

        $count = Appointment::where('employee', $employeeName)
            ->where('date', '>=', $today)
            ->where('status', 'booked')
            ->count();

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
            'department' => 'required|in:crewing,medical,accounting,recruitment,admin,support,training',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        // Prevent overlapping appointments
        $existing = Appointment::where('user_id', $validated['user_id'])
            ->where('date', $validated['date'])
            ->where('status', '!=', 'completed')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->exists();
        if ($existing) {
            return response()->json(['message' => 'Appointment time conflicts with an existing appointment'], 400);
        }

        if ($user->role !== 'admin' && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot book for another user'], 403);
        }

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

    public function schedule(Request $request)
    {
        $user = JWTAuth::user();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'department' => 'required|in:crewing,medical,accounting,recruitment,admin,support,training',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        // Prevent overlapping appointments
        $existing = Appointment::where('user_id', $validated['user_id'])
            ->where('date', $validated['date'])
            ->where('status', '!=', 'completed')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->exists();
        if ($existing) {
            return response()->json(['message' => 'Appointment time conflicts with an existing appointment'], 400);
        }

        if ($user->role !== 'admin' && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot book for another user'], 403);
        }

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
            'status' => 'pending',
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
        $this->updatePastBookedAppointments();
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
            'department' => 'required|in:crewing,medical,accounting,recruitment,admin,support,training',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        // Prevent overlapping appointments
        $existing = Appointment::where('user_id', $validated['user_id'])
            ->where('date', $validated['date'])
            ->where('status', '!=', 'completed')
            ->where('id', '!=', $id)
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->exists();
        if ($existing) {
            return response()->json(['message' => 'Appointment time conflicts with an existing appointment'], 400);
        }

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
            'status' => 'pending',
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

    public function destroy($id)
    {
        $user = JWTAuth::user();
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if ($user->role !== 'admin' && $appointment->user_id != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot cancel another user\'s appointment'], 403);
        }

        if (!$appointment->date || $this->getAppointmentStatus($appointment) === 'completed') {
            return response()->json(['message' => 'Only upcoming or today\'s appointments can be cancelled'], 400);
        }

        $appointment->update(['status' => 'cancelled']);

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment scheduled for {$appointment->date} has been cancelled.\n\n" .
                "Details of your cancelled appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "If you have any questions or need to reschedule, please contact us at: Concorde@fmssupport.com.ph\n\n",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Cancelled');
                }
            );
        }

        return response()->json(['message' => 'Appointment cancelled successfully'], 200);
    }

    public function delete($id)
    {
        $user = JWTAuth::user();

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if (!$appointment->date || $this->getAppointmentStatus($appointment) === 'completed') {
            return response()->json(['message' => 'Only upcoming or today\'s appointments can be cancelled'], 400);
        }

        $appointment->update(['status' => 'cancelled']);

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment scheduled for {$appointment->date} has been cancelled.\n\n" .
                "Details of your cancelled appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "If you have any questions or need to reschedule, please contact us at: Concorde@fmssupport.com.ph\n\n",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Cancelled');
                }
            );
        }

        return response()->json(['message' => 'Appointment cancelled successfully'], 200);
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
            'department' => 'required|in:crewing,medical,accounting,recruitment,admin,support,training',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'sometimes|string|max:255',
        ]);

        // Prevent overlapping appointments
        $existing = Appointment::where('user_id', $validated['user_id'] ?? $appointment->user_id)
            ->where('date', $validated['date'])
            ->where('status', '!=', 'completed')
            ->where('id', '!=', $id)
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->exists();
        if ($existing) {
            return response()->json(['message' => 'Appointment time conflicts with an existing appointment'], 400);
        }

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
            'purpose' => $validated['purpose'] ?? $appointment->purpose,
            'status' => 'booked',
        ]);

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment has been rescheduled.\n\n" .
                "Details of your new appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "Please visit your account for more details." .
                "If you have any questions or need to reschedule, please contact us at: Concorde@fmssupport.com.ph\n\n",
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

        $appointment->update(['status' => 'cancelled']);

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment scheduled for {$appointment->date} has been cancelled.\n\n" .
                "Details of your cancelled appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "If you have any questions or need to reschedule, please contact us at: Concorde@fmssupport.com.ph\n\n",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Cancelled');
                }
            );
        }

        return response()->json(['message' => 'Appointment cancelled successfully'], 200);
    }

    public function getUpcomingAppointments()
    {
        $this->updatePastBookedAppointments();
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $today = Carbon::today()->startOfDay();
        $appointments = Appointment::with(['user.profilePicture'])
            ->where('date', '>=', $today)
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($appointment) {
                $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                    ? ($this->isUrl($appointment->user->profilePicture->path)
                        ? $appointment->user->profilePicture->path
                        : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                    : null;

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
                        'profilePicture' => $profilePicture,
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
            'department' => 'required|in:crewing,medical,accounting,recruitment,admin,support,training',
            'crewing_dept' => 'required_if:department,crewing|in:maran gas,maran dry,maran tankers|nullable',
            'operator' => 'required_if:department,crewing|in:fleet crew manager,senior fleet crew operator,crew operator 1,crew operator 2,crew operator 3|nullable',
            'accounting_task' => 'required_if:department,accounting|in:allotment,final balance,check releasing|nullable',
            'employee_name' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
        ]);

        // Prevent overlapping appointments
        $existing = Appointment::where('user_id', $validated['user_id'])
            ->where('date', $validated['date'])
            ->where('status', '!=', 'completed')
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->exists();
        if ($existing) {
            return response()->json(['message' => 'Appointment time conflicts with an existing appointment'], 400);
        }

        if ($user->role !== 'admin' && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized: Cannot book for another user'], 403);
        }

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

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "You have an appointment scheduled.\n\n" .
                "Details of your appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "Please visit your account for more details." .
                "If you have any questions or need to reschedule, please contact us at: Concorde@fmssupport.com.ph\n\n",
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

    public function bookStatus($id)
    {
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if ($appointment->status !== 'pending') {
            return response()->json(['message' => 'Only pending appointments can be booked'], 400);
        }

        if (!$appointment->date || $this->getAppointmentStatus($appointment) === 'completed') {
            return response()->json(['message' => 'Only upcoming or today\'s appointments can be booked'], 400);
        }

        $appointment->update([
            'status' => 'booked',
        ]);

        $recipient = User::find($appointment->user_id);
        if ($recipient && $recipient->email) {
            Mail::raw(
                "Your appointment has been approved\n\n" .
                "Details of your appointment:\n" .
                "Date: {$appointment->date}\n" .
                "Start Time: {$appointment->start_time}\n" .
                "End Time: {$appointment->end_time}\n" .
                "Department: {$appointment->department}\n" .
                "Employee: {$appointment->employee}\n" .
                "Purpose: {$appointment->purpose}\n" .
                "Please visit your account for more details." .
                "If you have any questions or concerns, please contact us at: Concorde@fmssupport.com.ph\n\n",
                function ($message) use ($recipient) {
                    $message->to($recipient->email)
                            ->subject('Your Appointment Has Been Approved');
                }
            );
        }

        return response()->json([
            'message' => 'Appointment status updated to booked',
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

    public function getSpecific(Request $request)
    {
        $this->updatePastBookedAppointments();
        $user = JWTAuth::user();
        $employeeName = $user->first_name . ' ' . $user->last_name;

        if ($user->role === 'admin') {
            $appointments = Appointment::with(['user.profilePicture'])
                ->where('employee', $employeeName)
                ->where(function ($query) {
                    // Include all completed appointments, regardless of date
                    $query->where('status', 'completed')
                        // Include non-completed appointments from today onward
                        ->orWhere(function ($q) {
                            $q->where('status', '!=', 'completed')
                              ->where('date', '>=', Carbon::today()->startOfDay());
                        });
                })
                ->orderBy('date', 'asc')
                ->get()
                ->map(function ($appointment) {
                    $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                        ? ($this->isUrl($appointment->user->profilePicture->path)
                            ? $appointment->user->profilePicture->path
                            : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                        : null;

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
                            'profilePicture' => $profilePicture,
                        ] : null,
                    ];
                });
            return response()->json($appointments, 200);
        }

        $appointment = Appointment::with(['user.profilePicture'])
            ->where('user_id', $user->id)
            ->where('employee', $employeeName)
            ->where('date', '>=', Carbon::today()->startOfDay())
            ->where('status', '!=', 'completed')
            ->orderBy('date', 'asc')
            ->first();
        if ($appointment) {
            $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                ? ($this->isUrl($appointment->user->profilePicture->path)
                    ? $appointment->user->profilePicture->path
                    : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                : null;

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
                    'profilePicture' => $profilePicture,
                ],
            ], 200);
        }

        return response()->json([], 200);
    }

    public function getUpcomingSpecific(Request $request)
    {
        $this->updatePastBookedAppointments();
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $employeeName = $user->first_name . ' ' . $user->last_name;

        $today = Carbon::today()->startOfDay();
        $appointments = Appointment::with(['user.profilePicture'])
            ->where('employee', $employeeName)
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($appointment) {
                $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                    ? ($this->isUrl($appointment->user->profilePicture->path)
                        ? $appointment->user->profilePicture->path
                        : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                    : null;

                return [
                    'id' => $appointment->id,
                    'user_id' => $appointment->user_id,
                    'date' => $appointment->date,
                    'start_time' => $appointment->status === 'cancelled' ? null : $appointment->start_time,
                    'end_time' => $appointment->status === 'cancelled' ? null : $appointment->end_time,
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
                        'profilePicture' => $profilePicture,
                    ] : null,
                ];
            });

        return response()->json($appointments, 200);
    }

    public function getCrewCounts()
    {
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalCrewCount = User::where('role', 'user')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->count();

        $availableCrewCount = User::where('role', 'user')
            ->where('availability', 'available')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->count();

        $jobTitleCounts = User::where('role', 'user')
            ->where('availability', 'available')
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->whereNotNull('position')
            ->groupBy('position')
            ->select('position', \DB::raw('count(*) as count'))
            ->get()
            ->pluck('count', 'position')
            ->toArray();

        return response()->json([
            'available_crew_count' => $availableCrewCount,
            'total_crew_count' => $totalCrewCount,
            'job_title_counts' => $jobTitleCounts,
        ], 200);
    }

    public function complete($id)
    {
        $user = JWTAuth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if ($appointment->status !== 'booked') {
            return response()->json(['message' => 'Only booked appointments can be marked as completed'], 400);
        }

        $appointment->update([
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Appointment status updated to completed',
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

    public function history()
    {
        $this->updatePastBookedAppointments();
        $user = JWTAuth::user();

        if ($user->role !== 'user') {
            return response()->json(['message' => 'Unauthorized: Only users with role user can access appointment history'], 403);
        }

        $appointments = Appointment::with(['user.profilePicture'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($appointment) {
                $profilePicture = $appointment->user && $appointment->user->profilePicture && $appointment->user->profilePicture->path
                    ? ($this->isUrl($appointment->user->profilePicture->path)
                        ? $appointment->user->profilePicture->path
                        : env('APP_URL') . '/storage/' . ltrim($appointment->user->profilePicture->path, '/'))
                    : null;

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
                        'profilePicture' => $profilePicture,
                    ] : null,
                ];
            });

        return response()->json($appointments, 200);
    }

    public function permanentDelete($id)
    {
        $user = JWTAuth::user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized: Only admins can permanently delete appointments'], 403);
        }

        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }

        if ($appointment->status !== 'cancelled') {
            return response()->json(['message' => 'Only cancelled appointments can be permanently deleted'], 400);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment permanently deleted successfully'], 200);
    }
}