<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function create(Request $request)
    {
        // Validate request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'certificate_type' => 'required|in:Medical,Training,Contract,Employee ID',
        ]);

        // Check if the authenticated user is an admin
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Create notification
        $notification = Notification::create([
            'user_id' => $request->user_id,
            'type' => 'certificate_upload',
            'message' => "Please upload your {$request->certificate_type} Certificate",
            'status' => 'unread',
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification,
        ], 201);
    }

    // Fetch notifications for a specific user
    public function getUserNotifications(Request $request)
    {
        $user = Auth::user();
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications,
        ], 200);
    }
}