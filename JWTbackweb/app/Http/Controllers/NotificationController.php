<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Notifications\SendCertificateNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Notifications\SendAppointmentNotification;
use App\Notifications\SendCancelNotification;

class NotificationController extends Controller
{
    public function sendCertificateNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'certificate_type' => 'required|string|in:Medical,Training,Contract,Employee ID',
        ]);

        try {
            $user = User::findOrFail($request->user_id);
            Log::info('Sending notification to user ID: ' . $user->id . ', Certificate: ' . $request->certificate_type);
            $user->notify(new SendCertificateNotification($request->certificate_type));
            Log::info('Notification sent successfully for user ID: ' . $user->id);
            return response()->json(['message' => 'Notification sent successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send notification'], 500);
        }
    }

    public function getUserNotifications(Request $request)
    {
        try {
            $user = $request->user();
            Log::info('Fetching notifications for user ID: ' . $user->id);
            $notifications = $user->notifications()
                ->where('type', SendCertificateNotification::class)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'user_id' => $notification->notifiable_id,
                        'certificate_type' => $notification->data['certificate_type'],
                        'message' => $notification->data['message'],
                        'created_at' => $notification->created_at,
                        'read_at' => $notification->read_at,
                    ];
                });
            Log::info('Notifications found: ' . $notifications->count());
            return response()->json($notifications, 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    public function deleteNotification(Request $request, $id)
    {
        try {
            $user = $request->user();
            $notification = $user->notifications()->where('id', $id)->firstOrFail();
            $notification->delete();
            Log::info('Notification deleted for user ID: ' . $user->id . ', Notification ID: ' . $id);
            return response()->json(['message' => 'Notification deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete notification'], 500);
        }
    }

    public function sendAppointmentNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'appointment_id' => 'required|exists:appointments,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        try {
            $user = User::findOrFail($request->user_id);
            $appointment = [
                'id' => $request->appointment_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
            ];
            Log::info('Sending appointment notification to user ID: ' . $user->id);
            $user->notify(new SendAppointmentNotification($appointment));
            Log::info('Appointment notification sent successfully for user ID: ' . $user->id);
            return response()->json(['message' => 'Appointment notification sent'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send appointment notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send appointment notification'], 500);
        }
    }

    public function sendCancelNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'appointment_id' => 'required|exists:appointments,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        try {
            $user = User::findOrFail($request->user_id);
            $appointment = [
                'id' => $request->appointment_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
            ];
            Log::info('Sending cancel notification to user ID: ' . $user->id);
            $user->notify(new SendCancelNotification($appointment));
            Log::info('Cancel notification sent successfully for user ID: ' . $user->id);
            return response()->json(['message' => 'Cancel notification sent'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send cancel notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send cancel notification'], 500);
        }
    }
}