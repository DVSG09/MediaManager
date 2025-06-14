# MediaManager


Installing React App
-> npx create-react-app frontend


Initialize backend (Laravel)

brew install composer
composer create-project laravel/laravel .
php artisan serve



To download Laravel MongoDB Package:

composer require mongodb/laravel-mongodb


TO fix duplicate MongoDB Extension in Config:

sudo rm /opt/homebrew/etc/php/8.4/conf.d/ext-mongodb.ini

For JWT:

# Install the JWT package
composer require tymon/jwt-auth

# then Publish JWT config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

# Lastly, Generate JWT secret
php artisan jwt:secret


# Kill all the ports

# Kill multiple specific ports
kill -9 $(lsof -ti:8000,8001,8002,8003) # example
