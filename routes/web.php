<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('events')->controller(EventController::class)->group(function () {
        Route::get('/', 'index')->name('events.index');
        Route::get('/create', 'create')->name('events.create');
        Route::post('/', 'store')->name('events.store');
        Route::get('/{event}', 'show')->name('events.show');
        Route::get('/{event}/edit', 'edit')->name('events.edit');
        Route::put('/{event}', 'update')->name('events.update');
        Route::delete('/{event}', 'destroy')->name('events.destroy');
        
        
        Route::prefix('/{event}')->name('event.')->scopeBindings()->group(function () {
            
            Route::get('dashboard', function () {
                return Inertia::render('dashboard');
            })->name('dashboard');

            // Agenda Routes
            Route::prefix('agenda')->controller(AgendaController::class)->name('agenda.')->group(function () {
                Route::get('/', 'index')->name('index');
            });
        });
    });
    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
