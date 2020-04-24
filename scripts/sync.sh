#!/bin/bash
# This script will sync all of the files within the ../content directory
# to the remote raspberry pi content directory
# https://linux.die.net/man/1/rsync
# https://mike-hostetler.com/rsync-non-standard-ssh-port/
# https://serverfault.com/questions/508171/rsync-as-root-to-var-www-failing-with-protocol-version-mismatch
# https://askubuntu.com/questions/281742/sudo-no-tty-present-and-no-askpass-program-specified
# https://stackoverflow.com/questions/7114990/pseudo-terminal-will-not-be-allocated-because-stdin-is-not-a-terminal
# https://unix.stackexchange.com/questions/92123/rsync-all-files-of-remote-machine-over-ssh-without-root-user
# https://www.raspberrypi.org/documentation/configuration/security.md
# https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md
# https://askubuntu.com/questions/6723/change-folder-permissions-and-ownership
pushd ./
rsync -avzh --progress -e "ssh -p 1285" content/ bluebird@192.168.0.159:/var/www/cupandpen/content/
popd