<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StatusController extends Controller
{
    public function updateAvailability(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'availability' => 'required|string|in:On Board,Available,Vacation',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $user->availability = $request->input('availability');
        $user->save();

        return response()->json([
            'message' => 'Availability updated successfully',
            'user' => $user,
        ], 200);
    }
}