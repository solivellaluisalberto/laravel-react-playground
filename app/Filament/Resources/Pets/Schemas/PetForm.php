<?php

namespace App\Filament\Resources\Pets\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PetForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('gender')
                    ->required()
                    ->default('male'),
                DatePicker::make('birthday')
                    ->required(),
            ]);
    }
}
