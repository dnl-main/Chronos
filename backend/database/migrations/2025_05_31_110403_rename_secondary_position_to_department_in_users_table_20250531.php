<?php

   use Illuminate\Database\Migrations\Migration;
   use Illuminate\Database\Schema\Blueprint;
   use Illuminate\Support\Facades\Schema;

   class RenameSecondaryPositionToDepartmentInUsersTable20250531 extends Migration
   {
       public function up()
       {
           Schema::table('users', function (Blueprint $table) {
               $table->renameColumn('secondary_position', 'department');
           });
       }

       public function down()
       {
           Schema::table('users', function (Blueprint $table) {
               $table->renameColumn('department', 'secondary_position');
           });
       }
   }