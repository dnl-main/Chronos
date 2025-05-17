<?php

return [

    /*
    |-------------------------------------------------------------
    | Laravel CORS Settings
    |-------------------------------------------------------------
    |
    | Here you can configure your CORS settings for your application. By default, 
    | Laravel uses the `fruitcake/laravel-cors` package, but if you are using 
    | Laravel's built-in CORS handling, you can configure these options here.
    |
    */

    /*
    |-------------------------------------------------------------
    | Allowed Paths
    |-------------------------------------------------------------
    |
    | You can specify which paths should be included in the CORS handling.
    | In this case, all API routes are handled (for example: api/*).
    |
    */

    'paths' => ['api/*'],  // Apply CORS settings to all API routes.

    /*
    |-------------------------------------------------------------
    | Allowed Methods
    |-------------------------------------------------------------
    |
    | Specify which HTTP methods are allowed. Use specific methods instead of ['*']
    | when credentials are supported.
    |
    */

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Explicitly allow common methods

    /*
    |-------------------------------------------------------------
    | Allowed Origins
    |-------------------------------------------------------------
    |
    | List the origins that are allowed to make requests to your API. 
    | Replace `http://localhost:5173` with your front-end URL.
    |
    */

    'allowed_origins' => [
        'https://concorde-web.vercel.app',
    ],

    /*
    |-------------------------------------------------------------
    | Allowed Origins Patterns
    |-------------------------------------------------------------
    |
    | You can also use regular expressions to match multiple origins.
    | Leave this empty if you're not using it.
    |
    */

    'allowed_origins_patterns' => [],

    /*
    |-------------------------------------------------------------
    | Allowed Headers
    |-------------------------------------------------------------
    |
    | Specify which headers are allowed in the request. Include Authorization
    | for JWT tokens and other common headers.
    |
    */

    'allowed_headers' => ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],  // Explicitly allow specific headers

    /*
    |-------------------------------------------------------------
    | Exposed Headers
    |-------------------------------------------------------------
    |
    | Specify which headers are allowed to be exposed in the response.
    |
    */

    'exposed_headers' => [],  // Leave empty for no exposed headers.

    /*
    |-------------------------------------------------------------
    | Max Age
    |-------------------------------------------------------------
    |
    | Define how long the results of the pre-flight request can be cached.
    |
    */

    'max_age' => 0,  // Cache pre-flight responses for 0 seconds.

    /*
    |-------------------------------------------------------------
    | Supports Credentials
    |-------------------------------------------------------------
    |
    | By default, credentials (cookies, HTTP authentication) are not included.
    | Set this to `true` if you want to allow credentials in the request.
    |
    */

    'supports_credentials' => true,  // Enable credentials (cookies, HTTP authentication)
];