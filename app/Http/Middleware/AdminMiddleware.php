<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): BaseResponse
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            if ($request->wantsJson()) {
                return Response::json(['error' => 'Unauthorized. Authentication required.'], 401);
            }
            return redirect()->route('login');
        }

        // Check if user is an admin
        $user = Auth::user();
        if (!$user->isAdmin()) {
            if ($request->wantsJson()) {
                return Response::json(['error' => 'Unauthorized. Admin access required.'], 403);
            }
            return redirect()->route('dashboard')->with('error', 'Unauthorized. Admin access required.');
        }

        return $next($request);
    }
} 