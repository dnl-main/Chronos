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
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SuperadminController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Auth Routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Password Reset Routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// PSGC Routes
Route::get('/regions', [PSGCController::class, 'getRegions']);
Route::get('/provinces', [PSGCController::class, 'getProvinces']);
Route::get('/cities-municipalities', [PSGCController::class, 'getCitiesMunicipalities']);
Route::get('/barangays', [PSGCController::class, 'getBarangays']);

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
    Route::post('/user/update-position', [AuthController::class, 'updatePosition']); // for admin only

    // Availability Status
    Route::patch('/user/availability', [StatusController::class, 'updateAvailability']);

    // Appointment Routes
    Route::get('/appointment', [AppointmentController::class, 'index']);
    Route::post('/appointment', [AppointmentController::class, 'store']);
    Route::patch('/appointment/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointment/{id}', [AppointmentController::class, 'delete']);
    Route::delete('/appointment', [AppointmentController::class, 'destroy']);
    Route::get('/appointment/today/count', [AppointmentController::class, 'getTodayCount']);
    Route::get('/appointment/upcoming/count', [AppointmentController::class, 'getUpcomingCount']);
    Route::get('/appointment/upcoming', [AppointmentController::class, 'getUpcomingAppointments']);
    Route::put('/appointment/{id}/reschedule', [AppointmentController::class, 'reschedule']);
    Route::delete('/appointment/{id}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('/appointment/book', [AppointmentController::class, 'book']);

    // Profile Picture Upload
    Route::post('/user/upload-profile-picture', [ProfilePicController::class, 'upload']);
    Route::get('/user/profile-picture', [ProfilePicController::class, 'getProfilePicture']);

    // Change Password
    Route::post('/change-password', [ChangePasswordController::class, 'changePassword']);

    // Crew Controller
    Route::get('/crew-members', [CrewController::class, 'getCrewMembers']);
    Route::get('/crew-members/available/count', [CrewController::class, 'getAvailableCrewCount']);

    // File Upload
    Route::post('/upload-certificate', [UploadController::class, 'upload']);

    // Certificates
    Route::get('/certificates', [UploadController::class, 'getCertificates']);
    Route::post('/certificates/delete', [UploadController::class, 'deleteCertificate']);

    // Notifications
    Route::post('/notifications/upload', [NotificationController::class, 'sendCertificateNotification']);

    // User Details
    Route::get('/users/{id}', function ($id) {
        return App\Models\User::select('id', 'first_name', 'middle_name', 'last_name', 'position')->findOrFail($id);
    });

    // Superadmin Routes
        Route::prefix('superadmin')->middleware('role:superadmin')->group(function () {
        Route::get('/readusers', [SuperadminController::class, 'getAllUsers']);
        Route::post('/createusers', [SuperadminController::class, 'createUser']);
        Route::delete('/deleteusers/{id}', [SuperadminController::class, 'deleteUser']);
        Route::put('/updateusers/personal/{id}', [SuperadminController::class, 'updateUserPersonalDetails']);
        Route::put('/updateusers/address/{id}', [SuperadminController::class, 'updateUserAddress']);
    });
});