### Watch your stories unfold together

A collaborative writing site that feels like chat.

The site runs on Node.js and uses the following (these may change in the future and is not an exhaustive list):

- Express/Connect for the server middleware and routing.
- MongoDB to store the data.
- Monk to interface with MongoDB.
- Socket.io for updating stories in real-time.
- Jade for server HTML templates.
- RequireJS (using CommonJS format wrapper) for client-side modules.
- Stylus for creating stylesheets.
- Grunt for the build system.

The site is hosted on Nodejitsu and will be at the URL scribemania.com upon launch.

To run the site locally simply clone the repository and run ```node server.js``` (or ```nodemon server.js```)
inside the main directory then navigate to ```localhost:3000```.



(c) 2013 Fabien Brooke