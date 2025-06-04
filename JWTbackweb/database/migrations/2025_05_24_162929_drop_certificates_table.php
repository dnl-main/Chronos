<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropCertificatesTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('certificates');
    }

    public function down()
    {
        // Optionally, recreate the table in case of rollback
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });
    }
}