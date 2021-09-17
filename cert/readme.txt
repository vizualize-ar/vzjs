openssl genrsa -out private.key 4096
openssl req -new -sha256 -out private.csr -key private.key -subj '/CN=localhost,192.168.1.18'
# openssl x509 -req -days 3650 -in private.csr -signkey private.key -out private.crt -extensions req_ext
openssl x509 -req -days 3650 -in private.csr -signkey private.key -out private.crt -extfile domains.ext
openssl x509 -in private.crt -out private.pem -outform PEM

No password was used