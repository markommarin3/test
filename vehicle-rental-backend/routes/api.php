<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ComplaintController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::get('/vehicles/{id}/unavailable-dates', [ReservationController::class, 'getUnavailableDates']);

// Protected routes (authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/branches', function () { return \App\Models\Branch::all(); });
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    // Reservations
    Route::apiResource('reservations', ReservationController::class);
    
    // Payments
    Route::post('/payments', [PaymentController::class, 'process']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    
    // Documents
    Route::post('/documents', [DocumentController::class, 'upload']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews', [ReviewController::class, 'index']);

    // Complaints
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::get('/complaints', [ComplaintController::class, 'index']);
    
    // Admin/Službenik routes
    Route::middleware('role:ADMINISTRATOR,SLUZBENIK')->group(function () {
        Route::post('/vehicles', [VehicleController::class, 'store']);
        Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'index']); // Službenik mora videti korisnike da bi rezervisao
        Route::post('/damage-reports', [\App\Http\Controllers\Api\DamageReportController::class, 'store']);
        Route::get('/reservations/{id}/damage-reports', [\App\Http\Controllers\Api\DamageReportController::class, 'index']);
        Route::put('/complaints/{id}', [\App\Http\Controllers\Api\ComplaintController::class, 'update']);
        
        // Document verification
        Route::get('/documents/all', [DocumentController::class, 'getAllDocuments']);
        Route::post('/documents/{id}/approve', [DocumentController::class, 'approve']);
        Route::post('/documents/{id}/reject', [DocumentController::class, 'reject']);
    });
    
    // Admin only routes
    Route::middleware('role:ADMINISTRATOR')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::get('/stats', [\App\Http\Controllers\Api\StatsController::class, 'index']);
    });
});
