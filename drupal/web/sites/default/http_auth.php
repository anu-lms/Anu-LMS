<?php

// Make sure the platform.sh has env:HTTP_AUTH_USER and env:HTTP_AUTH_PASS
// variables set.
if (empty($_ENV['HTTP_AUTH_USER']) || empty($_ENV['HTTP_AUTH_PASS'])) {
  return;
}

if (!($_SERVER['PHP_AUTH_USER'] == $_ENV['HTTP_AUTH_USER'] && $_SERVER['PHP_AUTH_PW'] == $_ENV['HTTP_AUTH_PASS'])) {
  header('WWW-Authenticate: Basic realm="Restricted Page"');
  header('HTTP/1.0 401 Unauthorized');
  die(http_auth_cancel_page());
}

/**
 * Returns the page to the unauthenticated user.
 */
function http_auth_cancel_page() {
  return
    '<html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Anu LMS | Restricted Site</title>
      </head>
      <body class="http-restricted">
        <p>This page is restricted. Please contact the administrator for access.</p>
      </body>
    </html>';
}
