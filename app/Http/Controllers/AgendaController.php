<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
        /**
     * Display agenda items for an event
     */
    public function index()
    {
        return Inertia::render('agenda/index', [
            'agenda_items' => []
        ]);
    }
}
