<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Notification;

final class NotificationController extends Controller
{
    private Notification $notificationModel;

    public function __construct()
    {
        $this->notificationModel = new Notification();
    }

    /**
     * Liste les notifications de l'utilisateur connecté.
     */
    public function index(Request $request): void
    {
        $userId = (int) $request->user['id'];
        $notifications = $this->notificationModel->getForUser($userId);
        Response::success($notifications);
    }

    /**
     * Marque une notification comme lue.
     */
    public function markAsRead(Request $request, array $params): void
    {
        $id = (int) $params['id'];
        $this->notificationModel->markAsRead($id);
        Response::success(null, 'Notification marquée comme lue');
    }
}
