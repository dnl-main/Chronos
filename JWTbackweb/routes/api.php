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
Route::middleware('jwt.auth')->post('/registration', [AuthController::class, 'registration']);
Route::middleware('jwt.auth')->get('/user', [AuthController::class, 'getUser']);
Route::middleware('jwt.auth')->post('/logout', function (Request $request) {
    auth()->logout();
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
