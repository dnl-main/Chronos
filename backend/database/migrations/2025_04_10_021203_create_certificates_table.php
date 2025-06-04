<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('certificate_type');
            $table->date('upload_date');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key
            $table->timestamps(); // created_at and updated_at
        });
    }

    public function down(): void {
        Schema::dropIfExists('certificates');
    }
};
