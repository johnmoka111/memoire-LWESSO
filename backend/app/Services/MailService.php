<?php

declare(strict_types=1);

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use App\Core\Database;

/**
 * Service gérant l'envoi d'emails via PHPMailer.
 * Intègre également la journalisation dans la table `notifications`.
 */
final class MailService
{
    /**
     * Envoie un email et enregistre la trace en base de données.
     */
    public static function send(string $to, string $subject, string $body, string $type, ?int $userId = null): bool
    {
        $mail = new PHPMailer(true);
        $status = 'en_attente';
        $errorMsg = null;

        try {
            // Configuration Serveur
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USERNAME;
            $mail->Password   = MAIL_PASSWORD;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS pour port 587
            $mail->Port       = MAIL_PORT;
            $mail->CharSet    = 'UTF-8';
            
            // Mode débogage uniquement en développement
            if (APP_ENV === 'development') {
                $mail->SMTPDebug = 0; // Mettre à 2 pour voir les logs détaillés
            }

            // Destinataires
            $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $mail->addAddress($to);

            // Contenu
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            $status = 'envoye';
            $sentAt = date('Y-m-d H:i:s');
        } catch (Exception $e) {
            $status = 'erreur';
            $errorMsg = $mail->ErrorInfo;
            $sentAt = null;
        }

        // Journalisation dans la table `notifications` (comme demandé dans am.md)
        self::logNotification($userId, $to, $subject, $body, $type, $status, $errorMsg, $sentAt);

        return $status === 'envoye';
    }

    /**
     * Enregistre la notification en base de données pour la traçabilité.
     */
    private static function logNotification(?int $userId, string $to, string $subject, string $body, string $type, string $status, ?string $error, ?string $sentAt): void
    {
        $db = Database::getInstance();
        $sql = "INSERT INTO notifications (user_id, to_email, sujet, corps, type, statut, erreur_msg, sent_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $to, $subject, $body, $type, $status, $error, $sentAt]);
    }
}
