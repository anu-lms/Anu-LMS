<?php

namespace Drupal\anu_user\Plugin\rest\resource;

use Drupal\rest\ResourceResponse;
use Drupal\rest\Plugin\ResourceBase;

/**
 * Provides a resource to send Password reset email to the user.
 *
 * @RestResource(
 *   id = "user_request_password",
 *   label = @Translation("User Request Password"),
 *   uri_paths = {
 *     "https://www.drupal.org/link-relations/create" = "/user/password/request",
 *   }
 * )
 */
class UserRequestPasswordResource extends ResourceBase {

  /**
   * Responds to POST requests.
   *
   * Send Password reset email to the user.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function post($data) {
    $user_storage = \Drupal::entityManager()->getStorage('user');

    if (empty($data['username'])) {
      return new ResourceResponse([
        'message' => $this->t('Username is not recognized as a username or an email address.'),
      ], 406);
    }

    // Load by name if provided.
    $users = $user_storage->loadByProperties(['name' => trim($data['username'])]);
    if (empty($users)) {
      $users = $user_storage->loadByProperties(['mail' => trim($data['username'])]);
    }

    /** @var \Drupal\Core\Session\AccountInterface $account */
    $account = reset($users);
    if ($account && $account->id()) {
      if (user_is_blocked($account->getAccountName())) {
        return new ResourceResponse([
          'message' => $this->t('The user has not been activated or is blocked.'),
        ], 406);
      }

      // Send the password reset email.
      $mail = _user_mail_notify('password_reset', $account, $account->getPreferredLangcode());
      if (empty($mail)) {
        $message = $this->t('Unable to send email. Contact the site administrator if the problem persists.');
        $this->logger->error($message);
        return new ResourceResponse(['message' => $message], 406);
      }
      else {
        $this->logger->notice('Password reset instructions mailed to %name at %email.', ['%name' => $account->getAccountName(), '%email' => $account->getEmail()]);
        return new ResourceResponse(['email' => $account->getEmail()]);
      }
    }
    else {
      return new ResourceResponse([
        'message' => $this->t('@username is not recognized as a username or an email address.', ['@username' => $data['username']]),
      ], 406);
    }
  }

}
