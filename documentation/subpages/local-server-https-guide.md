
## Making HTTPS Work with Local Server

To make https work with a local server, I created self signed SSL certs. These will expired in 27 years so it is unlikely that they will need to be renewed but [here](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2) is the guide I followed to create the self signed certs for reference. I've pasted key steps below:

# From Scratch
Let’s walk through the process of creating certificates and build an HTTPS server and client to use them. First we’ll build a Certificate Authority to sign our own client certificates. (let’s also use it to sign our server certificate so we don’t have to pay a public certificate authority)

To simplify the configuration, let’s grab the following CA configuration file.
```
wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/ca.cnf
```
Next, we’ll create a new certificate authority using this configuration.

NOTE: I had to prefix openssl with winpty to get this command to work.
```
openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem
```
Now that we have our certificate authority in ca-key.pem and ca-crt.pem, let’s generate a private key for the server.
```
openssl genrsa -out server-key.pem 4096
```
Our next move is to generate a certificate signing request. Again to simplify configuration, let’s use server.cnf as a configuration shortcut.
```
wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/server.cnf
```
Now we’ll generate the certificate signing request.
```
openssl req -new -config server.cnf -key server-key.pem -out server-csr.pem
```
Now let’s sign the request using the certificate authority we created previously.
```
openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem
```
Our server certificate is all set and ready to go!