<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            // Add new columns
            $table->string('first_name')->after('id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->after('middle_name');

            // Remove old 'name' column
            $table->dropColumn('name');
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            // Restore old 'name' column
            $table->string('name')->after('id');

            // Drop new columns
            $table->dropColumn(['first_name', 'middle_name', 'last_name']);
        });
    }
};
