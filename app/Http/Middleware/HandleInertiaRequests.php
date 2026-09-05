<?php

namespace App\Http\Middleware;

use App\Models\CustomerRequest;
use App\Models\CustomerUser;
use App\Models\Leave;
use App\Models\Notification;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $isCustomer = $user instanceof CustomerUser;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name ?? $user->nama ?? 'User',
                    'email' => $user->email,
                    'roles' => method_exists($user, 'getRoleNames') ? $user->getRoleNames() : ['customer'],
                    'permissions' => method_exists($user, 'getAllPermissions') ? $user->getAllPermissions()->pluck('name') : [],
                ] : null,
            ],
            'pending_requests_count' => fn () => $isCustomer ? 0 : CustomerRequest::whereIn('status', ['baru', 'ditinjau'])->count(),
            'pending_leaves_count' => function () use ($user, $isCustomer) {
                if (! $user || $isCustomer) {
                    return 0;
                }
                if (method_exists($user, 'hasRole') && $user->hasRole('technician')) {
                    return Leave::where('user_id', $user->id)->where('status', 'menunggu')->count();
                }

                return Leave::where('status', 'menunggu')->count();
            },
            'pending_work_orders_count' => function () use ($user, $isCustomer) {
                if (! $user || $isCustomer) {
                    return 0;
                }
                if (method_exists($user, 'hasRole') && $user->hasRole('technician')) {
                    return WorkOrder::where('technician_id', $user->id)->whereIn('status', ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'])->count();
                }

                return WorkOrder::whereIn('status', ['DRAFT', 'ASSIGNED', 'PENDING_REVIEW'])->count();
            },
            'notifikasi_belum_dibaca' => fn () => ($user && ! $isCustomer) ? Notification::where('user_id', $user->id)->whereNull('dibaca_pada')->count() : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
