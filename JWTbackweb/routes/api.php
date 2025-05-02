<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\PSGCController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\AppointmentController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Auth Routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::post('/registration', [AuthController::class, 'registration']);
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/logout', function (Request $request) {
        auth()->logout();
        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully.',
        ]);
    });

    // Availability Status
    Route::patch('/user/availability', [StatusController::class, 'updateAvailability']);

    // Appointment Routes
    Route::get('/appointment', [AppointmentController::class, 'index']);
    Route::post('/appointment', [AppointmentController::class, 'store']);
    Route::delete('/appointment', [AppointmentController::class, 'destroy']);
});

// File Upload
Route::post('/upload-pdf', [UploadController::class, 'upload']);

// PSGC Routes
Route::get('/regions', [PSGCController::class, 'getRegions']);
Route::get('/provinces', [PSGCController::class, 'getProvinces']);
Route::get('/cities-municipalities', [PSGCController::class, 'getCitiesMunicipalities']);
Route::get('/barangays', [PSGCController::class, 'getBarangays']);
