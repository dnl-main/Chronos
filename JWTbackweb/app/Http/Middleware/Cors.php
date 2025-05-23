<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        // Get the origin from the request
        $origin = $request->headers->get('Origin');

        // Define allowed origins from config
        $allowedOrigins = config('cors.allowed_origins', []);

        // Check if the origin is allowed
        $allowOrigin = in_array($origin, $allowedOrigins, true) ? $origin : null;

        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 204); // Return 204 No Content for preflight
        } else {
            $response = $next($request);
        }

        // Set CORS headers if origin is allowed
        if ($allowOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Max-Age', config('cors.max_age', 86400));
        }

        return $response;
    }
}