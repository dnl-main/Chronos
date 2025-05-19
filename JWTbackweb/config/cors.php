<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Settings
    |--------------------------------------------------------------------------
    |
    | Here you can configure your CORS settings for your application. By default, 
    | Laravel uses the `fruitcake/laravel-cors` package, but if you are using 
    | Laravel's built-in CORS handling, you can configure these options here.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Allowed Paths
    |--------------------------------------------------------------------------
    |
    | You can specify which paths should be included in the CORS handling.
    | In this case, all API routes are handled (for example: api/*).
    |
    */

    'paths' => ['api/*'],  // Apply CORS settings to all API routes.

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Specify which HTTP methods are allowed. Use ['*'] to allow all methods.
    |
    */

    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | List the origins that are allowed to make requests to your API. 
    | Replace `http://localhost:5173` with your front-end URL.

    add ngrok url 
    |
    */

    'allowed_origins' => [
    'http://112.203.155.181',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://concorde-web.vercel.app',
    'https://heroic-sensible-buzzard.ngrok-free.app',
    ],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | You can also use regular expressions to match multiple origins.
    | Leave this empty if you're not using it.
    |
    */

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Specify which headers are allowed in the request. By default, all headers
    | are allowed with ['*'].
    |
    */

    'allowed_headers' => ['*'],  // Allow all headers

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Specify which headers are allowed to be exposed in the response.
    |
    */

    'exposed_headers' => [],  // Leave empty for no exposed headers.

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Define how long the results of the pre-flight request can be cached.
    |
    */

    'max_age' => 0,  // Cache pre-flight responses for 0 seconds.

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | By default, credentials (cookies, HTTP authentication) are not included.
    | Set this to `true` if you want to allow credentials in the request.
    |
    */

    'supports_credentials' => true,  // Disable credentials (cookies, HTTP authentication)
];
