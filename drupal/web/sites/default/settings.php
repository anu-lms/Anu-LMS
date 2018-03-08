<?php

// See https://api.drupal.org/api/drupal/sites!default!default.settings.php/8
$databases = [];
$config_directories = [];
$settings['update_free_access'] = FALSE;
$settings['install_profile'] = 'minimal';
$settings['container_yamls'][] = $app_root . '/' . $site_path . '/services.yml';
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

// Default hash salt.
$settings['hash_salt'] = 'pmh6LA6706mDIFTHfM5Seiy6PFp-3qIK2DWwWy5MtsHulxYxyzjsXDvrvAgTFZCmncUB76lnEA';


// Do not send emails by default.
// If you want to send emails from dev environment you should either:
// 1. Enable and configure reroute_email.
// 2. Disable reroute_email AND set config below to TRUE.
$config['ssb_mail.settings']['send'] = FALSE;

/**
 * Settings for Platform.sh environments.
 */
if (!empty($_ENV['PLATFORM_BRANCH'])) {
  // Include Platform.sh specific configs to connect
  // Drupal to Platform.sh servers.
  require_once __DIR__ . '/settings.platformsh.php';

  if ($_ENV['PLATFORM_BRANCH'] == 'master') {
    // Include production-only configs which override
    // development settings.
    require_once __DIR__ . '/settings.env_production.php';
  }
  else {
    // Enable http authentication on non-production branches.
    require_once __DIR__ . '/http_auth.php';
  }
}
// Local settings. These come last so that they can override anything.
else {
  require_once __DIR__ . '/settings.local.php';
}
