<?php

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

// Enable development configs.
$config['config_split.config_split.development']['status'] = TRUE;
$config['config_split.config_split.production']['status'] = FALSE;

// Set writable folder for temp file storage.
$config['system.file']['path']['temporary'] = '/tmp';

// Disable SMTP usage on all local environments.
$config['smtp.settings']['smtp_on'] = FALSE;

// Disable CSS preprocess on all local environments.
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// Make logging verbose.
$config['system.logging']['error_level'] = 'verbose';