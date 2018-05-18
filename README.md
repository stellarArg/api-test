# GHo
The KRF back-end use Express and Mongoose for MongoDB.

## setting dev environment
Environment tools required to use this project:

    npm install -g gulp

After clone this project you should install the npm packages and bower packages.

    npm install

To run the app you should use this command.

    npm start

## Running the test suite.

    npm test

## building and release

    npm run build

Copy the content of the *dist* folder into the prod server and install the npm packages with the *production* flag.

    npm install --production

For run with forever in a Linux environment:

    npm install -g forever
    forever start index.js

Or in a Windows environment:

    npm start

To clean the local *dist* folder after deploy use:

    gulp clean:dist

# Changing connection string to database.
You should set the MONGODB_URI environment variable or use a .env file. An example of a connection string is: (MONGODB_URI=mongodb://\<user\>:\<password\>@\<server\>:\<port\>/\<database\>)
