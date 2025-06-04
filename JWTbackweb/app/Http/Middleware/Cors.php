<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->headers->get('Origin');
        $allowedOrigins = config('cors.allowed_origins', []);

        // Log for debugging
        \Log::info('CORS: Request Origin: ' . ($origin ?? 'None'));
        \Log::info('CORS: Allowed Origins: ' . json_encode($allowedOrigins));

        // Check if the origin is allowed
        $allowOrigin = in_array($origin, $allowedOrigins, true) ? $origin : null;

        // Handle preflight OPTIONS request
        $response = $request->isMethod('OPTIONS') ? response('', 204) : $next($request);

        // Set CORS headers if origin is allowed
        if ($allowOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Max-Age', config('cors.max_age', 86400));
            \Log::info('CORS: Applied headers for origin: ' . $allowOrigin);
        } else {
            \Log::warning('CORS: Origin not allowed or missing: ' . ($origin ?? 'None'));
        }

        return $response;
    }
}