<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Notifications\SendCertificateNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Notifications\SendRescheduleNotification;
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


    public function sendRescheduleNotification(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            $user = User::findOrFail($request->user_id);
            Log::info('Sending reschedule notification to user ID: ' . $user->id . ', Date: ' . $request->appointment_date);
            $user->notify(new RescheduleNotification(
                $request->appointment_date,
                $request->start_time,
                $request->end_time
            ));
            Log::info('Reschedule notification sent successfully for user ID: ' . $user->id);
            return response()->json(['message' => 'Reschedule notification sent successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to send reschedule notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send reschedule notification'], 500);
        }
    }
}