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

**RUN JSLint!:**  

    for f in $(find ./node -name "*.js" -print | grep -v node_modules); do echo "Using: $f" && cat $f | ./jslint; done  

To generate the TODO list from the source, use:  
    
    rm TODO; for f in $(find ./node -name "*.js" -print | grep -v node_modules); do grep -Hn TODO $f >> TODO; done

###Things you can do...

####'Confs'
 - `http://localhost:8888/conf` (`GET` - lists all of the confs)
 - `http://localhost:8888/conf/<conf id>` (`GET` - returns a single conf by ID)
 - `http://localhost:8888/conf` (POST - Creates a client and returns its ID)
  - Use the following CURL command (or an equivalent) to `POST`: 
  
          curl -v -H "Content-Type: application/json" -X POST -d '{
               "legalName": "Santas Workshop",
			    "address": {
			        "line1": "123 Workshop Blvd.",
			        "line2": "Suite 1",
			        "city": "North Pole",
			        "stateOrProvince": "Arctic Circle",
			        "zipOrPostalCode": "H0H 0H0",
			        "latitude": 81.3000,
			        "longitude": 110.8000
			    },
			    "phoneNumber": "(123) 456-7890",
			    "contact": {
			        "salutation": "Mr.",
			        "name": {
			            "first": "Santa",
			            "last": "Claus"
			        },
			        "title": "Owner",
			        "phone": "x9876",
			        "fax": "(098) 765-4321",
			        "email": "santa@christmas.com"
			    },
			    "promotions": ["christmas2012", "christmas2013"],
			    "cardCodes": ["1", "2"],
			    "createdBy": "curlRequest",
			    "createdDate": "2012-12-24 00:00:00",
			    "modifiedBy": "curlRequest",
			    "modifiedDate": "2012-12-24 00:00:00",
			    "version": 1               
          }' http://localhost:8888/conf


###Users
 - `http://localhost:8888/users` (`GET` - lists the users)
 - `http://localhost:8888/users/<user id>` (`GET` - returns a single user by ID)
 - `http://localhost:8888/users` (POST - Creates a user and returns its ID)
  - Use the following CURL command (or an equivalent) to `POST`:
  
        curl -v -H "Content-Type: application/json" -X POST -d '{
		    "_phoneId": "1",
		    "displayName": "aUser",
            "access": {
                "id": "1234567890",
                "key": "039hrnqoehn30hqj3r0qpfin0fq3fnaeofna30j=="
            },
		    "address": {
		        "line1": "123 Fake Street",
		        "line2": "Apt 1",
		        "city": "Any City",
		        "stateOrProvince": "Ontario",
		        "zipOrPostalCode": "M6C 1Y5",
		        "latitude": 43.698905,
		        "longitude": -79.424963
		    },
		    "phoneNumber": "(416) 555-0123",
		    "dateJoined": "2012-09-01 00:00:00",
		    "lastLogin": "2012-09-01",
		    "lastActivity": "2012-09-01 00:00:00",
		    "createdBy": "curlRequest",
		    "createdDate": "2012-09-01 00:00:00",
		    "modifiedBy": "curlRequest",
		    "modifiedDate": "2012-09-01 00:00:00",
		    "version": 1
	    }' http://localhost:8888/users

###Things you can't yet do...
 - Use `PUT` requests to modify an entity by ID
 - Use API versions

###Some things on the to-do list...
 - Decide on and implement a key ~~issuance and~~ management strategy
 - Decide on and implement node instance clustering
 - Decide on and implement a load balancing setup for the node instances
 - Implement Server Side SSL for Mongo
 - Use Authentication for Mongo
 - Admin interface