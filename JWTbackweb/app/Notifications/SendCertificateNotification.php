<?php
namespace App\Notifications;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class SendCertificateNotification extends Notification
{
    protected $certificateType;

    public function __construct($certificateType)
    {
        $this->certificateType = $certificateType;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return new DatabaseMessage([
            'user_id' => $notifiable->id,
            'certificate_type' => $this->certificateType,
            'message' => "Please upload your {$this->certificateType} Certificate",
            'created_at' => now(),
        ]);
    }
}