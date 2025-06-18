FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libssl-dev

# Install PHP extensions
RUN docker-php-ext-install mbstring xml pcntl

# Install MongoDB extension
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application first (this was the issue!)
COPY . .

# Install dependencies (after copying application)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Run Laravel post-install scripts manually
RUN php artisan package:discover --ansi || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true

# Create storage directories and set permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views
RUN chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Start application
CMD php artisan serve --host=0.0.0.0 --port=$PORT
