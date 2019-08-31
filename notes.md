# Renewing SSL Certifictates

## Upgrading certbot
Use [brew](https://brew.sh/):
```
brew upgrade certbot
```

## Using certbot
Utilizing [certbot](https://certbot.eff.org/), you can utilize the following command:
```
sudo certbot certonly --manual
```

### Renewing cert
Should be able to just run the following to get the process started:
```
sudo certbot renew
```

## Create PFX file using openssl
```
sudo openssl pkcs12 -inkey /etc/letsencrypt/live/cupandpen.com/privkey.pem -in /etc/letsencrypt/live/cupandpen.com/cert.pem -export -out /etc/letsencrypt/live/cupandpen.com/cert.pfx
```

**Note:** [openssl](https://www.openssl.org/) can be installed using `brew install openssl`

## Resources
https://jessicadeen.com/how-to-manually-setup-a-lets-encrypt-ssl-cert-for-azure-web-app-with-linux/