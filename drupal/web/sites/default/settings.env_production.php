<?php

// Send emails on production only.
$config['ssb_mail.settings']['send'] = TRUE;

// Disable development configs.
$config['config_split.config_split.development']['status'] = FALSE;
$config['config_split.config_split.production']['status'] = TRUE;

// Don't show errors on live.
$config['system.logging']['error_level'] = 'hide';

// Enable css / js aggregation.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;
