[(Back to To TOC)](../TOC.md)
# Server [(view code)](https://github.com/jpiland16/hmv_test/blob/master/server.js)
Server.js is a Node Express server that controls all server side functionaltiy. It has the following roles:
- Serve the production build of the React app to clients, automatically updating whenever the production build changes.
- Keep track of files stored on the server machine's file system and tell clients what files are available for viewing.
- Handle incoming file uploads from clients, and notify listening clients when a file's status changes.
- Deliver individual data files by request (or deliver error messages if the request can't be fulfilled).

At present the server also holds the list of all API calls, since they are
hard-coded as parameters to HTTP request handlers.

## Server maintenance
Use any SSH terminal (For example, MobaXTerm) to connect to the VM using:
```
ssh <your-netid>@<vm-name>.vm.duke.edu
```
For example, if the site is hosted from `vcm-20389` (so I use the URL `vcm-20389.vm.duke.edu` to connect to the website) and my netID is stt13, I
connect to the server using:
```
ssh stt13@vcm-20389.vm.duke.edu
```
You will probably start in your NetID user folder, so you should navigate to
the `home/webs/hmv_test` directory to see the current website code. The server
is being run through `pm2` (Process Manager), so you can use `sudo pm2 logs` or
`sudo pm2 monit` to see the live log output of the server. This can be very helpful when
you encounter a problem on the website when requesting or uploading a file,
as you can just replicate the problem and see if the server prints out an error.
If you want the server to (1) start running modified `server.js` code or (2) re-scan
the data files, you can use `pm2 restart server.js` to close and reopen the server. You
should do this sparingly--ideally only when the website isn't in use.

If you want to modify the server's code for debugging an urgent issue, there are a few options. 
Using an FTP program like FileZilla, a user won't have permission to transfer files directly to the
`webs/` folder, but you can use `sudo cp <file-to-copy> <destination-file>` to copy modified files
from your user directory on the VM to the `webs/` dir. Any changes on the master branch in Git will automatically
go to the server files, and you could use `git checkout <branch-name>` to switch the server's Git branch, but
it is not best practice to use Git as a file transfer manager.

Make sure to run as a root user (use `sudo`) when installing any packages such as Python libraries, since
otherwise you will install them to your own user's Python package folder instead of the one in use by the server.

## Sockets and file progress
The server uses the `socket.io` library to handle web sockets. When a client requests a file,
it might not be ready immediately, so when the client requests this file, it establishes
a socket connection to the server, which allows the server to asynchronously send updates on the 
file's status. Right now, there are two types of updates it can send: the file is ready, or
the an error has occurred.

When a client wants to request a file through the Menu in the Viewport, they first
establish a socket connection to the server. If the target file exists in the server's
`files/` directory, the connection is immediately closed with the `File ready` signal, so the client
knows to make a GET request for the file. If the target file doesn't exist there, it
might still be processing--which is why the server keeps a Map (`app.locals.currentFiles`) of the names
of files that are still being processed. If the target file is on this map, then the client
is subscribed to it and will get notified when it can make the GET request.

## FormFileProcessor [(view code)](https://github.com/jpiland16/hmv_test/blob/master/src/server_side/FormFileProcessor.js)
The server uses FormFileProcessor to handle incoming `FormData` fields and files after
using the `formidable` library to deconstruct the object. When a file upload is submitted
through a POST request to `api/postform`, the FormFileProcessor translates the incoming
data to a data and metadata file which can be stored in their own directory in `files/user-uploads`.

A "data file" corresponds to one selectable sample on the website, and consists of
one directory with a metadata and quaternion file. See the [documentation of FormFileProcessor](https://github.com/jpiland16/hmv_test/blob/master/documentation/subpages/FormFileProcessor.md)
for more information on the metadata format.
