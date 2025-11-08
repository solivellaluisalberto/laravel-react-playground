<?php

namespace App\Filament\Pages\Tenancy;

use App\Models\Course;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\RegisterTenant;
use Filament\Schemas\Schema;

class RegisterTeam extends RegisterTenant
{
    public static function getLabel(): string
    {
        return 'Nuevo curso';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name'),
                TextInput::make('slug'),
            ]);
    }

    protected function handleRegistration(array $data): Course
    {
        $team = Course::create($data);

        // $team->members()->attach(auth()->user());

        return $team;
    }
}
