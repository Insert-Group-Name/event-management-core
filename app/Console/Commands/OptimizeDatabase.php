<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OptimizeDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:optimize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimizes database connections and tables';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database optimization...');

        // Clear any stuck connections (for PostgreSQL)
        if (config('database.default') === 'pgsql') {
            $this->info('Optimizing PostgreSQL connections...');
            
            try {
                // Kill idle connections that have been open too long
                DB::statement("
                    SELECT pg_terminate_backend(pid) 
                    FROM pg_stat_activity 
                    WHERE datname = ?
                    AND state = 'idle'
                    AND state_change < NOW() - INTERVAL '10 minutes'
                ", [config('database.connections.pgsql.database')]);
                
                $this->info('Idle connections terminated.');
                
                // Vacuum and analyze tables
                $this->info('Running VACUUM ANALYZE on tables...');
                DB::statement('VACUUM ANALYZE');
                
                $this->info('PostgreSQL optimization complete.');
            } catch (\Exception $e) {
                $this->error('Error optimizing PostgreSQL: ' . $e->getMessage());
            }
        }

        // Run analyze on tables
        $this->info('Analyzing database tables...');
        
        // Get tables using Schema facade instead of Doctrine
        $tables = Schema::getAllTables();
        
        foreach ($tables as $table) {
            // Extract table name from object based on database driver
            $tableName = config('database.default') === 'pgsql' 
                ? $table->tablename
                : (property_exists($table, 'name') ? $table->name : (string)$table);
                
            $this->info("Optimizing table: {$tableName}");
            try {
                DB::statement("ANALYZE {$tableName}");
            } catch (\Exception $e) {
                $this->error("Error analyzing table {$tableName}: " . $e->getMessage());
            }
        }

        $this->info('Database optimization completed!');
        
        return 0;
    }
}
