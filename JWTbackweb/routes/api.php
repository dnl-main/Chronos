<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\PSGCController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\ProfilePicController;
use App\Http\Controllers\CrewController;

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

    // User Update Routes
    Route::put('/user/update-address', [AuthController::class, 'updateAddress']);
    Route::put('/user/update-personal', [AuthController::class, 'updatePersonal']);

    // Availability Status
    Route::patch('/user/availability', [StatusController::class, 'updateAvailability']);

    // Appointment Routes
    Route::get('/appointment', [AppointmentController::class, 'index']);
    Route::post('/appointment', [AppointmentController::class, 'store']);
    Route::delete('/appointment', [AppointmentController::class, 'destroy']);
    Route::get('/appointment/today/count', [AppointmentController::class, 'getTodayCount']);
    Route::get('/appointment/upcoming/count', [AppointmentController::class, 'getUpcomingCount']);

    // Profile Picture Upload
    Route::post('/user/upload-profile-picture', [ProfilePicController::class, 'upload']);
    Route::get('/user/profile-picture', [ProfilePicController::class, 'getProfilePicture']);

    // Change Password
    Route::post('/change-password', [ChangePasswordController::class, 'changePassword']);

    // Crew Controller
    Route::get('/crew-members', [CrewController::class, 'getCrewMembers']);
    Route::get('/crew-members/available/count', [CrewController::class, 'getAvailableCrewCount']);
});

// File Upload
Route::post('/upload-pdf', [UploadController::class, 'upload']);

// PSGC Routes
Route::get('/regions', [PSGCController::class, 'getRegions']);
Route::get('/provinces', [PSGCController::class, 'getProvinces']);
Route::get('/cities-municipalities', [PSGCController::class, 'getCitiesMunicipalities']);
Route::get('/barangays', [PSGCController::class, 'getBarangays']);
