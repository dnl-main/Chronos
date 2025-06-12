<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PingController extends Controller
{
    public function sendNotificationEmail(Request $request)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'certificateType' => 'required|string',
            'certificateOtherInput' => 'nullable|string',
            'trainingType' => 'nullable|string',
            'trainingOtherInput' => 'nullable|string',
            'purpose' => 'required|string',
            'purposeOtherInput' => 'nullable|string',
            'note' => 'nullable|string',
            'recipientEmail' => 'required|email'
        ]);

        // Prepare email content
        $certificateType = $validated['certificateType'];
        $certificateDetails = $certificateType === 'Others' && !empty($validated['certificateOtherInput'])
            ? $validated['certificateOtherInput']
            : $certificateType;

        $trainingType = !empty($validated['trainingType'])
            ? ($validated['trainingType'] === 'Others' && !empty($validated['trainingOtherInput'])
                ? $validated['trainingOtherInput']
                : $validated['trainingType'])
            : 'Not specified';

        $purpose = $validated['purpose'] === 'Others' && !empty($validated['purposeOtherInput'])
            ? $validated['purposeOtherInput']
            : $validated['purpose'];

        $note = !empty($validated['note']) ? $validated['note'] : 'No additional notes provided.';

        // Construct email body
        $emailBody = "Certificate Notification\n\n";
        $emailBody .= "Certificate Type: {$certificateDetails}\n";
        $emailBody .= "Training Type: {$trainingType}\n";
        $emailBody .= "Purpose: {$purpose}\n";
        $emailBody .= "Note: {$note}\n";

        // Send raw email
        try {
            Mail::raw($emailBody, function ($message) use ($validated) {
                $message->to($validated['recipientEmail'])
                        ->subject('Certificate Notification')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            return response()->json([
                'message' => 'Notification email sent successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send notification email',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
