<?php
namespace App\Notifications;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class SendCancelNotification extends Notification
{
    protected $appointment;

    public function __construct($appointment)
    {
        $this->appointment = $appointment;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return new DatabaseMessage([
            'user_id' => $notifiable->id,
            'appointment_id' => $this->appointment['id'],
            'date' => $this->appointment['date'],
            'start_time' => $this->appointment['start_time'],
            'end_time' => $this->appointment['end_time'],
            'message' => 'Your appointment has been cancelled.',
            'created_at' => now(),
        ]);
    }
}