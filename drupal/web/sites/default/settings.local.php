<?php

/**
 * Rewrites URL for subdirectory usage.
 */
if (!empty($GLOBALS['request'])) {
  $requestUri = $GLOBALS['request']->server->get('REQUEST_URI');
  if (strpos($requestUri, '/admin') === 0) {
    $scriptName = $GLOBALS['request']->server->get('SCRIPT_NAME');
    $GLOBALS['request']->server->set('SCRIPT_NAME', '/admin' . $scriptName);
  }
}

// Database connection credentials.
$databases['default']['default'] = array (
  'database' => 'drupal',
  'username' => 'drupal',
  'password' => 'drupal',
  'prefix' => '',
  'host' => 'mariadb',
  'port' => '3306',
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);

// See https://www.drupal.org/node/1992030
$settings['trusted_host_patterns'] = [
  'docker\.localhost$',
  '^nginx$',
];

// Set writable folder for temp file storage.
$config['system.file']['path']['temporary'] = '/tmp';

// Disable SMTP usage on all local environments.
$config['smtp.settings']['smtp_on'] = FALSE;
