#!/usr/bin/env bash

# Removes older backups from the folder. Keeps last 2 backups on environment.
function remove_old_sql_dumps() {
  if [ "$1" ]; then

    # Move to the appropriate backups folder.
    cd $1

    # List all backups | find total number of backups | decrease by 1.
    NUMBER_OF_FOLDERS_TO_DEL=$(ls -1q | wc -l | awk '{print $0-1}')

    if [ "$NUMBER_OF_FOLDERS_TO_DEL" -gt 0 ]; then
        # List all backups | sort by name DESC | print last NUMBER_OF_FOLDERS_TO_DEL backups only | remove them.
        ls -1q | sort -nr | tail --lines=$NUMBER_OF_FOLDERS_TO_DEL | xargs rm -rfv
    fi;
  fi;

}

echo "== DB DUMP STARTED $(date +"%d.%m.%Y %T") =="
time drush sql-dump -r web --gzip --result-file -v

echo "Removing older dumps..."
# Grep database name from Drush status output to use it in backup folder.
DB_NAME=$(drush -r web sql-connect | sed -E "s/.*(--database=(\w+)).*/\\2/")

if [ "DB_NAME" ]; then
  remove_old_sql_dumps "$HOME/drush-backups/$DB_NAME";
fi;

echo "== DB DUMP FINISHED $(date +"%d.%m.%Y %T") =="
