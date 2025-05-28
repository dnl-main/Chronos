<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Certificate;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class UploadController extends Controller
{
   function upload(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:pdf|max:30000', // 30MB max
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|in:Medical,Training,Contract,Employee ID',
            'expiration_date' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Upload failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get the authenticated user
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
            // Check for existing certificate of the same type
            $existingCertificate = Certificate::where('user_id', $user->id)
                ->where('certificate_type', $request->certificate_type)
                ->first();

            if ($existingCertificate) {
                // Delete the existing certificate file from storage
                if (Storage::disk('public')->exists($existingCertificate->file_path)) {
                    Storage::disk('public')->delete($existingCertificate->file_path);
                }
                // Delete the existing certificate record from the database
                $existingCertificate->delete();
            }

            // Create directory for the new certificate
            $folderName = sprintf(
                '%s-%s-%s-%s/certificates',
                $user->id,
                str_replace(' ', '_', strtolower($user->first_name)),
                str_replace(' ', '_', strtolower($user->last_name)),
                strtolower($user->role)
            );
            $relativeFolder = $folderName;

            // Create directory with public read permissions
            $fullFolderPath = storage_path('app/public/' . $relativeFolder);
            if (!Storage::disk('public')->exists($relativeFolder)) {
                Storage::disk('public')->makeDirectory($relativeFolder);
                // Set permissions (Windows may ignore chmod, but try for compatibility)
                @chmod($fullFolderPath, 0755);
            }

            // Get the file and its original extension
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            // Sanitize certificate_name to avoid invalid characters
            $baseFilename = str_replace([' ', '/', '\\'], '_', $request->certificate_name);
            $filename = $baseFilename . '.' . $extension;

            // Check for existing files and increment if necessary
            $counter = 0;
            $newFilename = $filename;
            while (Storage::disk('public')->exists($relativeFolder . '/' . $newFilename)) {
                $counter++;
                $newFilename = $baseFilename . "($counter)." . $extension;
            }

            // Store the file
            $relativePath = $relativeFolder . '/' . $newFilename;
            Storage::disk('public')->putFileAs($relativeFolder, $file, $newFilename);

            // Set file permissions (Windows may ignore, but try)
            $fullFilePath = storage_path('app/public/' . $relativePath);
            @chmod($fullFilePath, 0644);

            // Save the certificate information to the database
            $certificate = Certificate::create([
                'user_id' => $user->id,
                'certificate_name' => $request->certificate_name . ($counter > 0 ? "($counter)" : ''),
                'certificate_type' => $request->certificate_type,
                'file_path' => $relativePath,
                'expiration_date' => $request->expiration_date ? Carbon::parse($request->expiration_date)->toDateString() : null,
            ]);

            // Return a response with the file path and success message
            return response()->json([
                'message' => 'PDF uploaded and saved successfully!',
                'file_path' => Storage::url($relativePath),
                'certificate' => $certificate
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Upload Exception:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to upload certificate: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getCertificates(Request $request)
    {
        try {
            $user = JWTAuth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

            // Check if the user is an admin
            if ($user->role === 'admin') {
                // Return all certificates for admin
                $certificates = Certificate::all();
            } else {
                // Return only the user's certificates for non-admin
                $certificates = Certificate::where('user_id', $user->id)->get();
            }

            return response()->json([
                'message' => 'Certificates retrieved successfully',
                'certificates' => $certificates,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Get Certificates Exception:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to retrieve certificates: ' . $e->getMessage(),
            ], 500);
        }
 
 
    }

public function deleteCertificate(Request $request)
{
    // Validate the request
    $validator = Validator::make($request->all(), [
        'id' => 'required|integer|exists:certificates,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    // Get the authenticated user
    $user = JWTAuth::user();
    if (!$user) {
        return response()->json([
            'message' => 'Unauthorized',
        ], 401);
    }

    try {
        // Find the certificate, allowing admins to bypass user_id check
        $certificate = Certificate::where('id', $request->id)
            ->when($user->role !== 'admin', function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->first();

        if (!$certificate) {
            return response()->json([
                'message' => 'Certificate not found or you do not have permission to delete it',
            ], 404);
        }

        // Delete the file from storage
        if (Storage::disk('public')->exists($certificate->file_path)) {
            if (!Storage::disk('public')->delete($certificate->file_path)) {
                \Log::warning('Failed to delete file from storage: ' . $certificate->file_path);
            }
        }

        // Delete the certificate from the database
        $certificate->delete();

        return response()->json([
            'message' => 'Certificate deleted successfully',
            'certificate_id' => $certificate->id,
        ], 200);
    } catch (\Exception $e) {
        \Log::error('Delete Certificate Exception:', ['message' => $e->getMessage()]);
        return response()->json([
            'message' => 'Failed to delete certificate: ' . $e->getMessage(),
        ], 500);
    }
}
}