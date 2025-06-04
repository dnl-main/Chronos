<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
   return view('welcome');
});

Route::get('/storage/{path}', function ($path) {
    $fullPath = 'public/' . $path;

    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'File not found');
    }

    return response()->file(Storage::disk('public')->path($path));
})->where('path', '.*')->middleware('admin.storage');
