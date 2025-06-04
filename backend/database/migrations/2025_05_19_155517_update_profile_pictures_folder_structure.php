<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\ProfilePicture;
use App\Models\User;

class UpdateProfilePicturesFolderStructure extends Migration
{
    public function up()
    {
        // Fetch all profile pictures
        $profilePictures = ProfilePicture::with('user')->get();

        foreach ($profilePictures as $profilePicture) {
            $user = $profilePicture->user;
            if (!$user) {
                continue; // Skip if user not found
            }

            // Current path (e.g., ian_sianghio/1747634066.jpeg)
            $oldPath = $profilePicture->path;
            if (!$oldPath) {
                continue;
            }

            // New folder name: userid-userfirst-userlast-userrole
            $newFolder = sprintf(
                '%s-%s-%s-%s',
                $user->id,
                str_replace(' ', '_', strtolower($user->first_name)),
                str_replace(' ', '_', strtolower($user->last_name)),
                strtolower($user->role)
            );

            // Extract filename from old path
            $filename = basename($oldPath);

            // New path (e.g., 123-ian-sianghio-admin/1747634066.jpeg)
            $newPath = $newFolder . '/' . $filename;

            // Move file in storage
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->move($oldPath, $newPath);
                \Log::info('Moved profile picture:', ['from' => $oldPath, 'to' => $newPath]);
            }

            // Update path in profile_pictures table
            $profilePicture->path = $newPath;
            $profilePicture->save();
        }
    }

    public function down()
    {
        // Fetch all profile pictures
        $profilePictures = ProfilePicture::with('user')->get();

        foreach ($profilePictures as $profilePicture) {
            $user = $profilePicture->user;
            if (!$user) {
                continue;
            }

            // Current path (e.g., 123-ian-sianghio-admin/1747634066.jpeg)
            $oldPath = $profilePicture->path;
            if (!$oldPath) {
                continue;
            }

            // Old folder name: userfirstname_userlastname
            $oldFolder = str_replace(' ', '_', strtolower($user->first_name . '_' . $user->last_name));

            // Extract filename from current path
            $filename = basename($oldPath);

            // Old path (e.g., ian_sianghio/1747634066.jpeg)
            $newPath = $oldFolder . '/' . $filename;

            // Move file back in storage
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->move($oldPath, $newPath);
                \Log::info('Moved profile picture back:', ['from' => $oldPath, 'to' => $newPath]);
            }

            // Update path in profile_pictures table
            $profilePicture->path = $newPath;
            $profilePicture->save();
        }
    }
}