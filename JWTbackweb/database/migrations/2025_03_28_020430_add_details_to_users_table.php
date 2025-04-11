<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('region')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('barangay')->nullable();
            $table->string('street')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('building_number')->nullable();
            $table->date('birthday')->nullable();
            $table->string('position')->nullable();
            $table->string('secondary_position')->nullable();
            $table->string('gender')->nullable();
            $table->string('civil_status')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'region',  'province', 'city', 'barangay', 'street', 'zip_code',
                'building_number', 'birthday', 'position',
                'secondary_position', 'gender', 'civil_status'
            ]);
        });
    }
};
