//Drop exiting confs and confversions
db.confs.drop();
db.confversions.drop();

//Insert 3 confs with various values for testing
db.confs.insert({
    v: 1,
    hostIdentification: {
        friendlyName: "testConfig",
        fqdn: "test.host.name",
        ip: "127.0.0.1",
        url: "http://a.b.c/app",
        environment: "development"
    }, 
    properties:[
        {key: "key1", value: "value1"},
        {key: "key2", value: "value2"},
        {key: "key3", value: "value3"},
        {key: "key with space", value: "value with space"}
    ]
});

db.confs.insert({
    v: 1,
    hostIdentification: {
        friendlyName: "testConfig2",
        fqdn: "some.fq.dn",
        ip: "192.0.2.1",
        url: "http://some.web.app/",
        environment: "qa"
    }, 
    properties:[
        {key: "foo", value: "bar"},
        {key: "wizzle", value: "wazzle"}
    ]
});

db.confs.insert({
    v: 1,
    hostIdentification: {
        friendlyName: "testConfig3",
        fqdn: "x.y.z",
        ip: "203.0.113.1",
        url: "http://xyz.com/w",
        environment: "production"
    }, 
    properties:[
        {key: "key1", value: "value1"},
        {key: "key2", value: "value2"},
        {key: "key3", value: "value3"},
        {key: "key4", value: "value4"},
        {key: "key5", value: "value5"},
        {key: "key6", value: "value6"},
        {key: "key7", value: "value7"},
        {key: "key8", value: "value8"},
        {key: "key9", value: "value9"},
        {key: "key10", value: "value10"}
    ]
});
