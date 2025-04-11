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
        // Validate that it's a PDF file with a maximum size of 30MB
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:pdf|max:30000', // max 30MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Upload failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Store the file in storage/app/public/uploads
        $path = $request->file('file')->store('public/uploads');
        $filename = basename($path);

        // Get the authenticated user's ID (from JWT)
        $userId = JWTAuth::user()->id;

        // Save the file information to the database (certificates table)
        $certificate = new Certificate();
        $certificate->filename = $filename;
        $certificate->upload_date = Carbon::now()->toDateString();
        $certificate->user_id = $userId;  // The user uploading the file
        $certificate->save();

        // Return a response with the file path and success message
        return response()->json([
            'message' => 'PDF uploaded and saved successfully!',
            'file_path' => Storage::url($path),
            'certificate' => $certificate  // Return certificate data (filename, upload_date, etc.)
        ]);
    }
}
