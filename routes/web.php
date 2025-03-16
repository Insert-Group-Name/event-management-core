<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // // Add a global dashboard route
    // Route::get('/dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    
    // Event routes
    Route::prefix('events')->group(function () {
        // Main event routes
        Route::controller(EventController::class)->group(function () {
            Route::get('/', 'index')->name('events.index');
            Route::get('/create', 'create')->name('events.create');
            Route::post('/', 'store')->name('events.store');
            Route::get('/{event}', 'show')->name('events.show');
            Route::get('/{event}/edit', 'edit')->name('events.edit');
            Route::put('/{event}', 'update')->name('events.update');
            Route::delete('/{event}', 'destroy')->name('events.destroy');
        });
        
        // Event-specific routes
        Route::prefix('/{event}')->name('event.')->group(function () {
            // Dashboard route
            Route::get('/dashboard', function ($event) {
                $eventModel = \App\Models\Event::findOrFail($event);
                return Inertia::render('events/dashboard', [
                    'event' => $eventModel
                ]);
            })->name('dashboard');

            // Event views
            Route::controller(EventController::class)->group(function () {
                // Story view route
                Route::get('/story', 'storyView')->name('story');
                
                // Public view route
                Route::get('/view', 'attendeeView')->name('view');
                
                // Agenda builder route
                Route::get('/agenda', 'agendaBuilder')->name('agenda.builder');
            });

            // Agenda Routes
            Route::prefix('agenda')->controller(AgendaController::class)->name('agenda.')->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{agendaItem}', 'show')->name('show');
                Route::get('/{agendaItem}/edit', 'edit')->name('edit');
                Route::put('/{agendaItem}', 'update')->name('update');
                Route::delete('/{agendaItem}', 'destroy')->name('destroy');
            });
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
