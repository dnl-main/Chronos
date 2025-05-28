<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateAppointmentsTable extends Migration
{
    public function up()
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Rename officer to employee
            $table->renameColumn('officer', 'employee');
            
            // Add new columns
            $table->string('crewing_dept')->nullable()->after('department');
            $table->string('operator')->nullable()->after('crewing_dept');
            $table->string('accounting_task')->nullable()->after('operator');
        });
    }

    public function down()
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Reverse renaming
            $table->renameColumn('employee', 'officer');
            
            // Drop new columns
            $table->dropColumn(['crewing_dept', 'operator', 'accounting_task']);
        });
    }
}