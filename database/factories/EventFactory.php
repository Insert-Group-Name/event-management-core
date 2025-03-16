<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-1 week', 'now');
        $endDate = fake()->dateTimeBetween(
            '+1 day',
            '+1 week'
        );

        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(3),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'user_id' => 1,
        ];
    }
}
