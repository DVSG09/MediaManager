<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public test route (no authentication required)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
        'mongodb_loaded' => extension_loaded('mongodb'),
        'jwt_secret_exists' => !empty(config('jwt.secret'))
    ]);
});

// Public authentication routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes (require authentication)
Route::group(['middleware' => 'auth:api'], function () {
    
    // Protected auth routes
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
    
    // Media routes
    Route::group(['prefix' => 'media'], function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::get('/', [MediaController::class, 'index']);
        Route::post('/upload', [MediaController::class, 'upload']);
        Route::delete('/{id}', [MediaController::class, 'destroy']);
        Route::get('/{id}', [MediaController::class, 'show']);
    });
    
    // Protected user route
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // In routes/api.php  
Route::middleware('auth:api')->get('/auth/test', function() {
    return response()->json([
        'message' => 'JWT is working',
        'user' => auth()->user()
    ]);
});
});