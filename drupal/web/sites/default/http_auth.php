<?php

// Make sure the platform.sh has env:HTTP_AUTH_USER and env:HTTP_AUTH_PASS
// variables set.
if (empty($_ENV['HTTP_AUTH_USER']) || empty($_ENV['HTTP_AUTH_PASS'])) {
  return;
}

// Ignore drush requests.
if (PHP_SAPI == 'cli') {
  return;
}

// If the request includes custom http-auth header, then validate it.
// This header was introduced to send requests from node.js server to the
// backend without http authentication.
$http_auth = $GLOBALS['request']->headers->get('http-auth');
if (!empty($http_auth)) {
  if ($http_auth == $_ENV['HTTP_AUTH_USER'] . ':' . $_ENV['HTTP_AUTH_PASS']) {
    return;
  }
}

// If this is the request from the same host, do not require http auth.
// The only way to get into the web site is to input http auth credentials,
// so we remove them for all internal requests within the site.
$referer = $GLOBALS['request']->server->get('HTTP_REFERER');
if (!empty($referer)) {
  $referer_url = parse_url($referer);
  if ($referer_url['host'] == $GLOBALS['request']->server->get('HTTP_HOST')) {
    return;
  }
}

// Get basic auth credentials from web browser.
$username = !empty($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : '';
$password = !empty($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : '';

// Show http auth if user and pass don't match variables in platform.sh.
if (!($username == $_ENV['HTTP_AUTH_USER'] && $password == $_ENV['HTTP_AUTH_PASS'])) {
  header('WWW-Authenticate: Basic realm="Restricted Page"');
  header('HTTP/1.0 401 Unauthorized');
  die();
}
