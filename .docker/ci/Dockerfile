FROM php:8.3-cli

# Instalar dependencias del sistema (optimizado para cacheo de capas)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl zip unzip \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    sqlite3 libsqlite3-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP base (estas raramente cambian)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd mbstring pdo pdo_mysql pdo_sqlite zip bcmath exif pcntl xml dom intl

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar Node.js 24
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && node -v && npm -v

# Instalar Xdebug (para tests)
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Extensiones PHP adicionales (añade aquí nuevas extensiones cuando las necesites)
# Ejemplo: RUN docker-php-ext-install opcache
# Ejemplo: RUN pecl install redis && docker-php-ext-enable redis

WORKDIR /var/www/html
