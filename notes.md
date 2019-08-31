# Renewing SSL Certifictates

## Upgrading certbot
Use brew:
`brew upgrade certbot`

## Using certbot
Utilizing `certbot`, you can utilize the following command:
`certbot certonly --manual`

### Renewing cert
Should be able to just run the following to get the process started:
`certbot renew`

**Note:** Most likely need to run the above commands using `sudo` (running as root/admin)

## Create PFX file using openssl


## Resources
https://jessicadeen.com/how-to-manually-setup-a-lets-encrypt-ssl-cert-for-azure-web-app-with-linux/