<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(RefCompaniesSeeder::class);
        // $this->call(RefCompaniesContactNumbersSeeder::class);
        // $this->call(RefBusinessUnitsSeeder::class);
        // $this->call(RefBusinessUnitContactNumbersSeeder::class);
        // $this->call(RefTeamsSeeder::class);
        // $this->call(RefDivisionsSeeder::class);
        // $this->call(RefDepartmentsSeeder::class);
        // $this->call(RefTeamDivisionsSeeder::class);
        // $this->call(RefPositionLevelsSeeder::class);
        // $this->call(RefGendersSeeder::class);

        // $this->call(RefSectionsSeeder::class);
        // $this->call(RefSubSectionsSeeder::class);
        // $this->call(RefLocationsSeeder::class);
        // $this->call(RefPositionsSeeder::class);
        // $this->call(RefSalutationsSeeder::class); 

        // $this->call(SalesDailyOutsSeeder::class); 
        
        // $this->call(RefSalesRankingSeeder::class); 
        // $this->call(SalesDailyOutAnnualSalesRankingSeeder::class); 
        // $this->call(RefMonthsSeeder::class);
        // $this->call(UsersSeeder::class);
        $this->call(RefModulesSeeder::class);
        $this->call(RefComponentsSeeder::class);
        $this->call(RefSubComponentsSeeder::class);
        $this->call(UserAccessModuleRightsSeeder::class);
        $this->call(UserAccessComponentRightsSeeder::class);
        $this->call(UserAccessSubComponentRightsSeeder::class);

    }
}
