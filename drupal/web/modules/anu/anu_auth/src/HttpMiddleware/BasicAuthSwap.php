<?php

namespace Drupal\anu_auth\HttpMiddleware;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Uses the basic auth information to provide the client credentials for OAuth2.
 */
class BasicAuthSwap implements HttpKernelInterface {

  /**
   * The wrapped HTTP kernel.
   *
   * @var \Symfony\Component\HttpKernel\HttpKernelInterface
   */
  protected $httpKernel;

  /**
   * Constructs a BasicAuthSwap object.
   *
   * @param \Symfony\Component\HttpKernel\HttpKernelInterface $http_kernel
   *   The decorated kernel.
   */
  public function __construct(HttpKernelInterface $http_kernel) {
    $this->httpKernel = $http_kernel;
  }

  /**
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The input request.
   * @param int $type
   *   The type of the request. One of HttpKernelInterface::MASTER_REQUEST or
   *   HttpKernelInterface::SUB_REQUEST.
   * @param bool $catch
   *   Whether to catch exceptions or not.
   *
   * @throws \Exception
   *   When an Exception occurs during processing.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   A Response instance
   */
  public function handle(Request $request, $type = self::MASTER_REQUEST, $catch = TRUE) {
    return $this->httpKernel->handle($request, $type, $catch);
  }

}
