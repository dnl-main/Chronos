<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use JWTAuth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user->role !== $role) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized: Insufficient role permissions',
                ], 403);
            }
            return $next($request);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized: Invalid token',
            ], 401);
        }
    }
}