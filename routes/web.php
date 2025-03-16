<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('events')->controller(EventController::class)->group(function () {
        Route::get('/', 'index');
    });

    Route::prefix('agenda')->controller(AgendaController::class)->group(function () {
        Route::get('/', 'index');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
