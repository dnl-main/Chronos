<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfilePicture;
use Illuminate\Support\Facades\Storage;

class ProfilePicController extends Controller
{
    public function upload(Request $request)
    {
       
        \Log::info('Upload Request:', [
            'method' => $request->method(),
            'files' => $request->allFiles(),
            'headers' => $request->headers->all(),
            'origin' => $request->header('Origin'),
            'mime_type' => $request->file('profile_picture') ? $request->file('profile_picture')->getMimeType() : null,
        ]);

        if ($request->isMethod('OPTIONS')) {
            \Log::info('Handling OPTIONS request');
            return response()->json([], 200);
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'profile_picture' => 'required|file|mimes:jpeg,png,jpg,webp,heic,heif,jfif|max:102400',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation Errors:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Get the authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
            // Define the storage path: userid-userfirst-userlast-userrole
            $folderName = sprintf(
                '%s-%s-%s-%s',
                $user->id,
                str_replace(' ', '_', strtolower($user->first_name)),
                str_replace(' ', '_', strtolower($user->last_name)),
                strtolower($user->role)
            );
            $relativeFolder = $folderName;

            // Check for existing profile picture and delete it
            $existingPicture = ProfilePicture::where('user_id', $user->id)->first();
            if ($existingPicture && Storage::disk('public')->exists($existingPicture->path)) {
                Storage::disk('public')->delete($existingPicture->path);
                \Log::info('Deleted previous profile picture:', ['path' => $existingPicture->path]);
            }

            // Generate a unique filename
            $file = $request->file('profile_picture');
            $filename = time() . '.' . $file->getClientOriginalExtension();

            // Store the file in storage/app/public/userid-userfirst-userlast-userrole
            $relativePath = $relativeFolder . '/' . $filename;
            Storage::disk('public')->putFileAs($relativeFolder, $file, $filename);

            // Store or update profile picture path in the profile_pictures table
            ProfilePicture::updateOrCreate(
                ['user_id' => $user->id],
                ['path' => $relativePath]
            );

            return response()->json([
                'success' => true,
                'message' => 'Profile picture uploaded successfully',
                'profile_picture' => $relativePath,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Upload Exception:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile picture: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getProfilePicture(Request $request)
    {
        \Log::info('Get Profile Picture Request:', [
            'headers' => $request->headers->all(),
            'origin' => $request->header('Origin'),
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $profilePicture = ProfilePicture::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'path' => $profilePicture ? $profilePicture->path : null,
        ], 200);
    }
}