<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password; // Import the Password facade
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PasswordResetController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            // Log the latest token for debugging
            $tokenData = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();
            \Log::info('Password reset token stored: ', (array) $tokenData);
        }

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['message' => __($status)], 400);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        \Log::info('Incoming token: ' . $request->token); // Log the incoming token

        // Find the token record
        $tokenData = DB::table('password_reset_tokens')
            ->get()
            ->first(function ($record) use ($request) {
                return Hash::check($request->token, $record->token);
            });

        if (!$tokenData) {
            \Log::info('No matching token found in password_reset_tokens');
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        // Find the user by email from the token record
        $user = \App\Models\User::where('email', $tokenData->email)->first();

        if (!$user) {
            \Log::info('User not found for email: ' . $tokenData->email);
            return response()->json(['message' => 'User not found'], 400);
        }

        // Update the user's password
        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        // Delete the token after successful reset
        DB::table('password_reset_tokens')
            ->where('email', $tokenData->email)
            ->delete();

        return response()->json(['message' => 'Password reset successfully'], 200);
    }
}