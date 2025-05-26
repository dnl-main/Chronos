<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyNotificationsTableToMatchRequiredSchema extends Migration
{
    public function up()
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('notifications', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('notifications', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }

    public function down()
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('type')->after('user_id');
            $table->enum('status', ['unread', 'read'])->default('unread')->after('message');
            $table->timestamp('updated_at')->nullable()->after('created_at');
        });
    }
}