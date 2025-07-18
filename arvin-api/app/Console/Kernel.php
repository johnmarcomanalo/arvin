<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
   
    

    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('update:sales-daily-out')
        //      ->withoutOverlapping();
        
        $schedule->command('update:sales-tracker')
             ->everyFiveMinutes()
             ->withoutOverlapping();

        $schedule->command('command:update-client-sales-out-logs')
             ->everyFiveMinutes()
             ->withoutOverlapping();

             
    }
    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
