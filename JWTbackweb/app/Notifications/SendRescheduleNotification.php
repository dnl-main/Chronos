<?php
namespace App\Notifications;

use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class SendRescheduleNotification extends Notification
{
    protected $appointmentDate;
    protected $startTime;
    protected $endTime;

    public function __construct($appointmentDate, $startTime, $endTime)
    {
        $this->appointmentDate = $appointmentDate;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return new DatabaseMessage([
            'user_id' => $notifiable->id,
            'appointment_date' => $this->appointmentDate,
            'start_time' => $this->startTime,
            'end_time' => $this->endTime,
            'message' => "Your appointment has been rescheduled to {$this->appointmentDate} from {$this->startTime} to {$this->endTime}.",
            'created_at' => now(),
        ]);
    }
}