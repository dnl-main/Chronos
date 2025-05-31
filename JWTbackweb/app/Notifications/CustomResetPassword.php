<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class CustomResetPassword extends Notification
{
    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // Define allowed frontend URLs based on environment
        $isLocal = app()->environment('local');
        $frontendUrl = $isLocal
            ? env('FRONTEND_URL', 'http://localhost:5173') // Local development
            : env('FRONTEND_URL', 'https://concorde-web.vercel.app'); // Production

        $url = $frontendUrl . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        // Log the values for debugging
        Log::info('Environment: ' . app()->environment());
        Log::info('FRONTEND_URL: ' . $frontendUrl);
        Log::info('Reset Password URL: ' . $url);

        return (new MailMessage)
            ->subject('Reset Your Password')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $url)
            ->line('If you did not request a password reset, no further action is required.');
    }
}