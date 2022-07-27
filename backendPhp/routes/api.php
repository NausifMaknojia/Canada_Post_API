<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Controller;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});

Route::group(['middleware' => 'auth:sanctum'], function(){
    //All secure URL's
    Route::post('/users/fetchData',[Controller::class,'fetchData']);

});

//Route::get('/try',[phpApiRequest::class,'index']);

Route::post('/users/add',[Controller::class,'store']);

Route::get('/users/validate',[Controller::class,'checkUser']);

Route::post('/users/get_UserLogin',[Controller::class,'UserLogin']);

Route::get('/CanadaPostAPI/getRates',[Controller::class,'CanadaPostgetRates']);

