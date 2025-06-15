<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Certificate;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;

class UploadController extends Controller
{
    function upload(Request $request)
    {
        // Define valid certificate types
          $validCertificateTypes = [
        // Medical
        'Medical-Health Check',
        'Medical-Pre-Employment Medical Examination',
        'Medical-Fitness for Sea Service',
        'Medical-Medical Certificate / Fitness for Sea Service',
        'Medical-Health Insurance',
        'Medical-Medical Certificate',

        // Training
        'Training-Workshop',
        'Training-Certification',
        'Training-Seaman Training I',
        'Training-Leadership Training I',
        'Training-Seaman Training II',
        'Training-Leadership Training II',
        'Training-Leadership Training III',
        'Training-Safety Certificates / Basic Safety Training & Crowd Management',
        'Training-Deck Cadet',
        'Training-Engine Cadet Training',
        'Training-Steward Training',
        'Training-BRM (Bridge Resource Management)',
        'Training-ERM (Engine Room Resource Management)',
        'Training-Radar / ARPA / ECDIS',
        'Training-LNG Carrier Operations',
        'Training-Oil Tanker Familiarization',
        'Training-Leadership & Teamwork',

        // PDOS
        'PDOS-Cultural Briefing',
        'PDOS-Financial Literacy',
        'PDOS-Seafarer Safety Awareness',
        'PDOS-Shipboard Emergency Procedures',
        'PDOS-Sexual Harassment Awareness',
        'PDOS-COVID Protocol Orientation',

        // Employee Document
        'Employee Document-Passport',
        'Employee Document- Pre-Employment Orientation Seminar (PEOS) ',
        'Employee Document-ID Card',
        'Employee Document-Contract',
        'Employee Document-Seaman’s Book',
        'Employee Document-Contract of Employment',
        'Employee Document-Crew ID-Card',
        'Employee Document-C1/D Visa',
        'Employee Document-Criminal Record Certificate',
        'Employee Document-Sea Service Record',

        // SOLAS
        'SOLAS-International Ship Safety Equipment Certificate',
        'SOLAS-Minimum Safe Manning Certificate',
        'SOLAS-International Ship Construction Certificate',
        'SOLAS-Passenger Ship Safety Certificate',
        'SOLAS-Cargo Ship Safety Certificate',
        'SOLAS-Cargo Ship Safety Construction Certificate',
        'SOLAS-Cargo Ship Safety Equipment Certificate',
        'SOLAS-Cargo Ship Safety Radio Certificate',
        'SOLAS-International Tonnage Certificate',
        'SOLAS-International Load Line Certificate',
        'SOLAS-Safety Management Certificate',
        'SOLAS-Ship Security Certificate',
        'SOLAS-International Oil Pollution Prevention Certificate',
        'SOLAS-International Sewage Pollution Prevention Certificate',
        'SOLAS-International Air Pollution Prevention Certificate',
        'SOLAS-PST (Personal Survival Techniques)',
        'SOLAS-FPFF (Fire Prevention and Fire Fighting)',
        'SOLAS-EFA (Elementary First Aid)',
        'SOLAS-PSSR (Personal Safety and Social Responsibility)',
        'SOLAS-Security Awareness',
        'SOLAS-Advanced Fire Fighting',
        'SOLAS-PSCRB (Rescue Boats)',
        'SOLAS-Enclosed Space Rescue',
        'SOLAS-HUET (Helicopter Escape)',

        // STCW Certifications
        'STCW Certifications-STCW Basic Safety Training',
        'STCW Certifications-STCW Proficiency in Survival Craft and Rescue Boats',
        'STCW Certifications-STCW Proficiency in Fast Rescue Boats',
        'STCW Certifications-STCW Proficiency in Designated Security Duties',
        'STCW Certifications-STCW Proficiency in Security Awareness',
        'STCW Certifications-STCW Proficiency in Crisis Management and Human Behavior',
        'STCW Certifications-STCW Proficiency in Advanced Fire Fighting',
        'STCW Certifications-STCW Proficiency in Medical First Aid',

        // Seaman's Passport
        'Seaman\'s Passport-Able Seaman — Unlimited',
        'Seaman\'s Passport-Able Seaman — Limited',
        'Seaman\'s Passport-Able Seaman',
        'Seaman\'s Passport-STCW Basic Safety (PST, FPFF, EFA, PSSR)',
        'Seaman\'s Passport-Watchkeeping Certificate',
        'Seaman\'s Passport-Crowd Management & Crisis Control',
        'Seaman\'s Passport-Radar Navigation & Collision Avoidance',
        'Seaman\'s Passport-Ship Security Awareness',
        'Seaman\'s Passport-Others',
        
    ];

        // Validate the request
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:jpg,jpeg,png,pdf|max:30000', // 30MB max
            'certificate_name' => 'required|string|max:255',
            'certificate_type' => 'required|string|in:' . implode(',', $validCertificateTypes),
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
                @chmod($fullFolderPath, 0755);
            }

            // Get the file and its original extension
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();

            // Parse certificate type
            [$primaryType, $subType] = explode('-', $request->certificate_type, 2);

            // Sanitize inputs for filename
            $sanitizedPrimaryType = str_replace([' ', '/', '\\'], '_', strtolower($primaryType));
            $sanitizedSubType = str_replace([' ', '/', '\\'], '_', strtolower($subType));
            $sanitizedCertName = str_replace([' ', '/', '\\'], '_', strtolower($request->certificate_name));

            // Generate filename: primaryType-subType-certificateName
            $baseFilename = sprintf('%s-%s-%s', $sanitizedPrimaryType, $sanitizedSubType, $sanitizedCertName);
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

            // Set file permissions
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

            return response()->json([
                'message' => 'File uploaded and saved successfully!',
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

            $query = Certificate::query();

            if ($request->has('user_id')) {
                $query->where('user_id', $request->input('user_id'));
            } else {
                if ($user->role !== 'admin') {
                    $query->where('user_id', $user->id);
                }
            }

            $certificates = $query->get();

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
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:certificates,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = JWTAuth::user();
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
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

            if (Storage::disk('public')->exists($certificate->file_path)) {
                if (!Storage::disk('public')->delete($certificate->file_path)) {
                    \Log::warning('Failed to delete file from storage: ' . $certificate->file_path);
                }
            }

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

    public function approve(Request $request, $id)
    {
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $certificate = Certificate::find($id);
        if (!$certificate) {
            return response()->json(['message' => 'Certificate not found'], 404);
        }

        try {
            $certificate->update(['status' => 'approved']);

            Mail::raw(
                "Your certificate has been approved.\n\n" .
                "Certificate Name: {$certificate->certificate_name}\n" .
                "Certificate Type: {$certificate->certificate_type}\n" .
                "Status: Approved\n" .
                "Please log in to your account to view details.\n\n" .
                "View Certificates: " . url('/certificates') . "\n\n" .
                "Thank you for using our platform!",
                function ($message) use ($certificate) {
                    $message->to($certificate->user->email)
                            ->subject("Certificate {$certificate->certificate_name} Approved");
                }
            );

            return response()->json([
                'message' => "Certificate {$certificate->certificate_name} has been approved",
                'certificate' => [
                    'id' => $certificate->id,
                    'certificate_name' => $certificate->certificate_name,
                    'certificate_type' => $certificate->certificate_type,
                    'file_path' => $certificate->file_path,
                    'user_id' => $certificate->user_id,
                    'expiration_date' => $certificate->expiration_date,
                    'status' => $certificate->status,
                ],
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Approve Certificate Exception:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to approve certificate: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function decline($id)
    {
        $user = JWTAuth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $certificate = Certificate::find($id);
        if (!$certificate) {
            return response()->json(['message' => 'Certificate not found'], 404);
        }

        try {
            if (Storage::disk('public')->exists($certificate->file_path)) {
                Storage::disk('public')->delete($certificate->file_path);
            }

            Mail::raw(
                "Your Certificate has been declined\n\n" .
                "Certificate Name: {$certificate->certificate_name}\n" .
                "Certificate Type: {$certificate->certificate_type}\n" .
                "Status: Declined\n" .
                "Please log in to your account to view details.\n\n" .
                "View Certificates: " . url('/certificates') . "\n\n" .
                "Please reupload\n\n",
                function ($message) use ($certificate) {
                    $message->to($certificate->user->email)
                            ->subject("Certificate {$certificate->certificate_name} Declined");
                }
            );

            $certificate->delete();

            return response()->json([
                'message' => "Certificate {$certificate->certificate_name} has been declined and deleted",
                'certificate_id' => $certificate->id,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Decline Certificate Exception:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to decline and delete certificate: ' . $e->getMessage(),
            ], 500);
        }
    }
}