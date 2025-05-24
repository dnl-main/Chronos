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
    public function upload(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:pdf|max:30000', // 30MB max
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|max:255',
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
           
            $folderName = sprintf(
                '%s-%s-%s-%s/certificates',
                $user->id,
                str_replace(' ', '_', strtolower($user->first_name)),
                str_replace(' ', '_', strtolower($user->last_name)),
                strtolower($user->role)
            );
            $relativeFolder = $folderName;

            // Generate filename
            $file = $request->file('file');
            $filename = time() . '.' . $file->getClientOriginalExtension();

            // Store the file in storage/app/public/userid-userfirst-userlast-userrole/certificates
            $relativePath = $relativeFolder . '/' . $filename;
            Storage::disk('public')->putFileAs($relativeFolder, $file, $filename);

            // Check for existing certificate for this user and delete it (optional, adjust as needed)
            $existingCertificate = Certificate::where('user_id', $user->id)
                ->where('certificate_name', $request->certificate_name)
                ->first();
            if ($existingCertificate && Storage::disk('public')->exists($existingCertificate->file_path)) {
                Storage::disk('public')->delete($existingCertificate->file_path);
            }

            // Save the certificate information to the database
            $certificate = Certificate::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'certificate_name' => $request->certificate_name,
                ],
                [
                    'certificate_type' => $request->certificate_type,
                    'file_path' => $relativePath, // Store path like public/1-ian_kenneth-sianghio-user/certificates/1234567890.pdf
                    'expiration_date' => $request->expiration_date ? Carbon::parse($request->expiration_date)->toDateString() : null,
                ]
            );

            // Return a response with the file path and success message
            return response()->json([
                'message' => 'PDF uploaded and saved successfully!',
                'file_path' => Storage::url($relativePath), // URL like /storage/1-ian_kenneth-sianghio-user/certificates/1234567890.pdf
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

        $certificates = Certificate::where('user_id', $user->id)->get();

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
}