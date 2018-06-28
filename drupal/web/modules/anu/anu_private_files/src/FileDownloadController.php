<?php

namespace Drupal\anu_private_files;

use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Downloads or displays private files.
 */
class FileDownloadController extends ControllerBase {

  /**
   * Menu router callback.
   * Displays or downloads private file.
   *
   * @param $id
   *   File ID.
   *
   * @param bool $download
   *   Whether to force download the file or let the browser decide.
   *
   * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException
   */
  public function download($id, $download = FALSE) {

    try {

      // Attempt to load the file from the request.
      $file = \Drupal::entityTypeManager()
        ->getStorage('file')
        ->load($id);

      // Get the file's URI.
      $uri = $file->getFileUri();

    }
    catch (\Exception $exception) {

      $message = new FormattableMarkup('Could not load the file. Error: @error', [
        '@error' => $exception->getMessage(),
      ]);
      \Drupal::logger('anu_private_files')->error($message);
      return new UnprocessableEntityHttpException(['message' => $message], 406);
    }

    // Make sure the file physically exists on the server.
    if (file_exists($uri)) {

      // Let other modules provide headers and controls access to the file.
      $headers = $this->moduleHandler()->invokeAll('file_download', [$uri]);

      // Make sure the user has access to the private file.
      foreach ($headers as $result) {
        if ($result == -1) {
          throw new AccessDeniedHttpException();
        }
      }

      // If the download flag is enabled, set headers for downloading.
      if ($download) {
        $headers = [
          'Content-Type' => 'force-download',
          'Content-Disposition' => 'attachment; filename="' . $file->getFilename() . '"',
          'Content-Length' => $file->getSize(),
          'Content-Transfer-Encoding' => 'binary',
          'Pragma' => 'no-cache',
          'Cache-Control' => 'private',
          'Expires' => '0',
          'Accept-Ranges' => 'bytes',
        ] + $headers;
      }

      if (count($headers)) {
        // \Drupal\Core\EventSubscriber\FinishResponseSubscriber::onRespond()
        // sets response as not cacheable if the Cache-Control header is not
        // already modified. We pass in FALSE for non-private schemes for the
        // $public parameter to make sure we don't change the headers.
        return new BinaryFileResponse($uri, 200, $headers, FALSE);
      }

      throw new AccessDeniedHttpException();
    }

    throw new NotFoundHttpException();
  }

  /**
   * Access callback for the route.
   *
   * Request to get file can't have access headers, so it executes from anonymous user
   * we catch given in link access token and load user account by it.
   * We set loaded by access token account as currently active (but not actually login that user into the backend)
   * so that user can make further actions with correct permissions.
   *
   * @param $accessToken
   *   String representing Simple OAuth token.
   *
   * @return \Drupal\Core\Access\AccessResultAllowed|\Drupal\Core\Access\AccessResultForbidden
   */
  public function access($accessToken) {

    // Set the http header for the server with access token. It is necessary
    // to create the correct request object with auth header.
    $_SERVER['HTTP_AUTHORIZATION'] = 'Bearer ' . $accessToken;

    // Create a request object with authentication.
    $request = Request::createFromGlobals();

    // Using simple oauth for validating user against his access token in the
    // request.
    $account = \Drupal::service('simple_oauth.authentication.simple_oauth')
      ->authenticate($request);

    // If account associated with the token doesn't exist - we should not
    // allow any further action.
    if (empty($account)) {
      return AccessResult::forbidden();
    }

    // If user exists we set found account as currently active to make all further actions (like file download) be taken
    // on behalf of this user with proper permissions.
    \Drupal::currentUser()->setAccount($account);

    // Let the request pass to the route callback.
    return AccessResult::allowed();
  }

}
