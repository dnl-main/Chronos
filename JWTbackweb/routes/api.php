<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\PSGCController;


Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/signup', [AuthController::class, 'signup']);  // Route for user signup
Route::post('/login', [AuthController::class, 'login']);    // Route for user login
Route::middleware('auth:api')->post('/registration', [AuthController::class, 'registration']); // Registration after login
Route::middleware('auth:api')->get('/user', [AuthController::class, 'getUser']);

// Route for logging out, which will invalidate the JWT token
Route::middleware('auth:api')->post('/logout', function (Request $request) {
    auth()->logout();  // Logs out the user by invalidating the JWT token
    return response()->json([
        'status' => true,
        'message' => 'Logged out successfully.',
    ]);
});

//Upload Handling Route
Route::post('/upload-pdf', [UploadController::class, 'upload']);

//PSGC Do not touch
Route::get('/regions', [PSGCController::class, 'getRegions']);
Route::get('/provinces', [PSGCController::class, 'getProvinces']);
Route::get('/cities-municipalities', [PSGCController::class, 'getCitiesMunicipalities']);
Route::get('/barangays', [PSGCController::class, 'getBarangays']);
