<?php

// See https://api.drupal.org/api/drupal/sites!default!default.settings.php/8
$databases = [];
$config_directories = [];
$settings['update_free_access'] = FALSE;
$settings['install_profile'] = 'minimal';
$settings['container_yamls'][] = $app_root . '/services.yml';
$settings['file_scan_ignore_directories'] = [
  'node_modules',
  'bower_components',
];

// This is defined inside the read-only "config" directory, deployed via Git.
$config_directories[CONFIG_SYNC_DIRECTORY] = '../config/sync';

// Error logging.
$config['system.logging']['error_level'] = 'verbose';

// Disable CSS and JS aggregation.
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// By default always stick to dev configs.
$config['config_split.config_split.development']['status'] = TRUE;
$config['config_split.config_split.production']['status'] = FALSE;

/**
 * Settings for Platform.sh environments.
 */
echo 'settings.php';
echo "\r\n";
print $_ENV['PLATFORM_BRANCH'];
if (!empty($_ENV['PLATFORM_BRANCH'])) {
  echo 'in platform';
  // Include Platform.sh specific configs to connect
  // Drupal to Platform.sh servers.
  require_once(__DIR__ . '/settings.platformsh.php');

  /*if ($_ENV['PLATFORM_BRANCH'] == 'master') {
    // Include production-only configs which override
    // development settings.
    require_once(__DIR__ . '/settings.env_production.php');
  }*/
}
// Local settings. These come last so that they can override anything.
else {
  echo 'using local';
  require_once(__DIR__ . '/settings.local.php');
}
