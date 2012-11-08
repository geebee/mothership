// Class to represent a host identification entry
function HostIdentification(friendlyName, fqdn, ip, url) {
    this.friendlyName = ko.protectedObservable(friendlyName);
    this.fqdn = ko.protectedObservable(fqdn);
    this.ip = ko.protectedObservable(ip);
    this.url = ko.protectedObservable(url);
    this.focused = ko.protectedObservable();
}
// Class to represent an individual property entry 
function Property(key, value) {
    this.key = ko.protectedObservable(key);
    this.key.focused = ko.observable();
    this.value = ko.protectedObservable(value);
}

// Overall viewmodel for this screen, along with initial state
function ConfViewModel() {
    var self = this;
    this.hostIdentification = ko.observable();
    this.properties = ko.observableArray([]);
    this.selectedElement = ko.observable();

    /*//{{{ Set fake initial state...
    self.hostIdentification = ko.observable(new HostIdentification("testConf", "a.b.c", "127.0.0.1", "http://a.b.c/url"));

    self.properties = ko.observableArray([
        new Property("key1", "value1"),
        new Property("key2", "value2"),
        new Property("key3", "value3")
    ]);
    *///}}}
    
    // Behaviors
    this.addProperty = function() {
        var newProperty = new Property("", "");
        self.properties.push(newProperty);
        self.selectedElement(newProperty);
    };
    
    this.removeProperty = function(property) {
        self.properties.destroy(property);
        self.selectedElement(null);
    };

    this.editElement = function(item) {
        self.selectedElement(item);
        item.key.focused(true);
    };

    this.acceptElementEdit = function(e) {
        self.selectedElement().key.commit();
        self.selectedElement().value.commit();
        self.selectedElement(null);
    };

    this.cancelElementEdit = function(e) {
        self.selectedElement().key.reset();
        self.selectedElement().value.reset();
        self.selectedElement(null);
    };

    this.templateToUse = function(property) {
        return self.selectedElement() === property ? "editTemplate" : "viewTemplate";
    };

    this.persistedProperties = ko.computed(function() {
        return ko.utils.arrayFilter(self.properties(), function(property) { return !property._destroy});
    });

    this.loadConf = function(friendlyName){
        console.log("loadConf - friendlyName: %s", friendlyName); 
        // Load initial state from server, convert it to Property/HostIdentification instances, populate observables//{{{
        $.getJSON("/conf/" + friendlyName, function(allData) {
            var h = allData.hostIdentification;
            var mappedHostIdentification = new HostIdentification(h.friendlyName, h.fqdn, h.ip, h.url);
            var mappedProperties = $.map(allData.properties, function(p) { 
                var keyName = Object.keys(p)[0];
                return new Property(keyName, p[keyName]);
            });

            self.hostIdentification(mappedHostIdentification);
            self.properties(mappedProperties);
        });
    };

    this.deleteConf = function(e) {
        console.log("deleteConf - friendlyName: %s", e.friendlyName()); 
        /*
        $.ajax("/conf/" + friendlyName + "/host", {
            data: ko.toJson({hostIdentification: self.hostIdentification}),
            type: "DELETE",
            contentType: "application/json",
            success: function(result) { 
                console.log(result);
                $("#hostInformationArea span").addClass("control-group").addClass("success")
            },
            failure: function(result) {
                console.log(result);
                $("#hostInformationArea span").addClass("control-group").addClass("error")
            }
        });
        */
    };

    this.saveHostIdentification = function(friendlyName, successCallback, failureCallback) {
        console.log("saveHostIdentification - friendlyName: %s", friendlyName); 
        hI = "{\"hostIdentification\": ";
        hI += ko.toJSON(this.hostIdentification);
        hI += "}";
        console.log("saveHostIdentification - hostIdentification: %s", hI);

        $.ajax("/conf/" + friendlyName + "/host", {
            data: hI,
            type: "PUT",
            contentType: "application/json",
            success: function(res, textStatus, jqXHR) {
                successCallback(res, textStatus);
            },
            error: function(res, textStatus, errorThrown) {
                failureCallback(res, textStatus);
            } 
        });
    };


    this.upsertKeyValue= function(friendlyName, kvObject) {
        console.log("upsertKeyValue - friendlyName: %s, kvObject: {%s: %s}", friendlyName, kvObject.key, kvObject.value); 
        /*
        $.ajax("/conf/testConf/property", {
            data: ko.toJson({properties: self.properties}),
            type: "PUT",
            contentType: "application/json",
            success: function(result) { 
                console.log(result);
                $("#propertyArea table tbody tr td").not(".buttons").addClass("control-group").addClass("success")
            },
            failure: function(result) {
                console.log(result);
                $("#propertyArea table tbody tr td").not(".buttons").addClass("control-group").addClass("error")
            }
        });
        */
    };
}
