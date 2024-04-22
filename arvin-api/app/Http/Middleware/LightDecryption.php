<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Http\Controllers\LightSecurityController;

class LightDecryption
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        try {
            if(count($request->all()) != 0)
                $request = LightSecurityController::DecryptionAES($request);
            return $next($request);
        } catch (Illuminate\Contracts\Encryption\DecryptException $e) {
            throw $e;
        }
        
    }
}
