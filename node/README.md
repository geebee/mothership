mothership - README
-----
	This project will serve as a set of RESTful web services endpoints that will allow a consuming system to request runtime parameters and apply them to the environment.

	The main problem attempting to be solved with mothership is that of ensuring that the identical code files, compiled artifacts, etc. that make it out of testing are the same as the ones that eventually make it into production.

	One of its largest advantages is that it can integrate into virtually any existing system that exposes its configuration interface by essentially just replacing the streamed read from an on-disk config file, to that of the appropriate endpoint of the mothership.

	The endpoints that return a single conf will allow those properties to be returned in what will become a number of supported formats via a query string parameter. It would look as follows: https://<mothership FQDN>/conf/<conf ID>?style=<some style>

	The available styles are:
		* raw - key=value return (text/plain)
		* quoted - "key"="value" return (text/plain)
 		* json - JSON object return (application/json)
		* properties - java web application .properties file style (text/plain)
		* xml - XML document return (text/xml)

###How To Run:
 - Prerequisites: MongoDB (installed), node.js (installed)
 - Run Mongo:
  1. Edit mongo/mothership-mongo.conf to point to reasonable paths for your environment.
  2. Run the command: "mongod --config mongo/mothership-mongo.conf"

_NOTE: If you already are running MongoDB, and know your connection URL, then ignore the above..._

  1. Change to the 'node' directory of the checkout
  2. Apply the appropriate database settings in ./db/init.js
  3. Run the command: "node app.js"


To generate the TODO list from the source, use:

    rm TODO; for f in $(find ./node -name "*.js" -print | grep -v node_modules); do grep -Hn TODO $f >> TODO; done

###Things you can't yet do...
 - Use `PUT` requests to modify an entity by ID
 - Use API versions

