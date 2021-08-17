[(Back to To TOC)](../TOC.md)
## HTTPS Guide 
This guide will walk you through the steps I took to switch the website to HTTPS and will hopefully help you to troubleshoot if there is an issue with SSL Certificate renewal.

SSL Certs should renew automatically before the 90 day license expires as there is a systemd timer running an auto renewal command. The first thing you should do if there is an error is run <code> sudo cerbot renew </code> in the the project directory of the VM. If this is sucessful, the systemd timer may not be working and you can find more information on automated renewal [here](https://certbot.eff.org/docs/using.html?highlight=hooks#renewing-certificates). If this is not successful, this guide will give you background information to troubleshoot the error. 

For the VM, I used a free certificate authority called [Let's Encrypt](https://letsencrypt.org/getting-started/). In order to get a certificate for the website’s domain, you have to demonstrate control over the domain which I did using the [Certbot](https://certbot.eff.org/about/) Acme Client.

This [link](https://certbot.eff.org/lets-encrypt/ubuntufocal-other) will show you the steps I took to get Cerbot installed. I stopped following Certbot's guide at Step 7 and switched to the guide [Using Let's Encrypt with Express](https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625). I've pasted the key steps from the guide below and modified them to fit this project:

## Using Let's Encrypt with Express Guide

We’re going to be using Certbot in webroot mode by passing in the --webroot switch. In short, Certbot will put a file somewhere under our server directory that we have to make sure to serve over HTTP. Reading over the Certbot documentation for Webroot mode, we can see that Certbot will look for the hosted file at the http://<your_server_url>/.well-known/acme-challenge/ path. If it can successfully retrieve the file that it placed in that path on the server through HTTP, then it will create an SSL certificate for you!

## Serving Up Static Files

As stated above, the path that Certbot will look for to verify your webserver is /.well-known/acme-challenge. Often, the folder that holds all the static content for a website is named public or static and if you had a text file under /static/test-text/mytextfile.txt , you could get to it by fetching http://<your_server_url/test-text/mytextfile.txt . Knowing that, let’s create the directory structure for Certbot and wire it up in Express.
```
cd public
mkdir -p .well-known/acme-challenge
```

The commands above are run from the project root and assume that the static content folder is called public.
```
// filename: app.js
const express = require('express');
const app = express();
app.get('/.well-known/*', (req, res) => {
    let path = req.url;
    let fileRoot = `${__dirname}/public`;
    if (fs.existsSync(fileRoot + "/" + path)) {
        res.sendFile(path, {root: fileRoot});
    } else {
        res.send(`File or directory "${path}" not found!`);
    }
});
```
Now that express is wired up to serve the correct path, let’s test it.
```
echo "this is a test" > public/.well-known/acme-challenge/9001
curl http://vcm-20389.vm.duke.edu/.well-known/acme-challenge/9001
```
This should print out “this is a test” in your console! Success!
Let’s generate us a new SSL certificate.

## Certbot

The next step is to generate our certificate. As mentioned above, we’re going to run Certbot in Webroot mode. This will require two pieces of information, a path to use as the webroot (using the -w switch) and domain name (using the -d switch).

```
certbot --webroot -w ./public -d vcm-20389.vm.duke.edu
```

NOTE: If this command fails, this [guide](https://flaviocopes.com/express-letsencrypt-ssl/) will show you how to get the SSL Certs manually.

The command above assumes that you’re in your project directory. After running that command, you’ll see a success message with a location to your certificates. They are usually located in /etc/letsencrypt/live/vcm-20389.vm.duke.edu . Information about what these files are can be found in the Webroot section of the Certbot User Guide. We’re going to be using the fullchain.pem and the privkey.pem files with our Express server.

Yay! We have a shiny new SSL certificate! Let’s put it to use.

## Express and HTTPS

Express, out of the box, only uses HTTP. We can wire up Express to use HTTPS by using the https node module. To do this, we’re going to need two files, a certificate and a private key. As an aside, do not ever share your server private key and only let authorized users access the private key file.
I also recommend either copying fullchain.pem and privkey.pem into your project directory or creating symbolic links to them (I used symbolic links). Creating symbolic links makes the renewal process easier but it depends on your preference.

The code assumes that you have fullchain.pem and privkey.pem in a folder called sslcert in your project directory.
```
// filename: app.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
// Set up express server here
const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};
https.createServer(options, app).listen(443);
  ```

You can now use the SSL Server Test to verify your server. Green locks for everyone!