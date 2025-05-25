<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AdminStorageAccess
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();

            // Allow admins unrestricted access
            if ($user->role === 'admin') {
                return $next($request);
            }

            // For non-admins, check if the requested path belongs to their folder
            $path = $request->route('path');
            $userFolder = sprintf(
                '%s-%s-%s-%s',
                $user->id,
                str_replace(' ', '_', strtolower($user->first_name)),
                str_replace(' ', '_', strtolower($user->last_name)),
                strtolower($user->role)
            );

            if (str_starts_with($path, $userFolder)) {
                return $next($request); // Allow non-admins to access their own folder
            }

            // Deny access for non-admins trying to access other folders
            Log::warning('Unauthorized storage access attempt', [
                'user_id' => $user->id,
                'role' => $user->role,
                'path' => $path,
            ]);
            return response()->json(['message' => 'Unauthorized: Access restricted'], 403);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            Log::warning('Invalid token for storage access', ['path' => $request->path()]);
            return response()->json(['message' => 'Invalid token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            Log::warning('No token provided for storage access', ['path' => $request->path()]);
            return response()->json(['message' => 'Token not provided'], 401);
        }
    }
}