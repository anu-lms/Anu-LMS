We import/export dummy content with Default content module, 
see more information: http://cgit.drupalcode.org/default_content/tree/README.md

## Export
Update content on the site and run by drush:
`drush --user=1 dcer ENTITY_TYPE ENTITY_ID --folder=modules/anu/anu_test_content/content`

Examples:
`drush --user=1 dcer node 3 --folder=modules/anu/anu_test_content/content`

## Import
Enable `anu_test_content` module, it will import content from `./anu_test_content/content` folder automatically.

## Notes
We use `better_normalizers` module to keep exported files in base64 format.
