//wrapper for an observable that protects value until committed
ko.protectedObservable = function(initialValue) {
    //private variables
    var _temp = initialValue;
    var _actual = ko.observable(initialValue);

    var result = ko.dependentObservable({
        read: _actual,
        write: function(newValue) {
            _temp = newValue;
        }
    });
    
    //commit the temporary value to our observable, if it is different
    result.commit = function() {
        if (_temp !== _actual()) {
            _actual(_temp);
        }
    };

    //notify subscribers to update their value with the original
    result.reset = function() {
        _actual.valueHasMutated();
        _temp = _actual();
    };

    return result;
};

// Class to represent a host identification entry
function HostIdentification(friendlyName, ip, fqdn, url) {
    var self = this;
    self.friendlyName = ko.protectedObservable(friendlyName);
    self.fqdn = ko.protectedObservable(fqdn);
    self.ip = ko.protectedObservable(ip);
    self.url = ko.protectedObservable(url);
}

// Class to represent an individual property entry 
function Property(key, value) {
    var self = this;
    self.key = ko.protectedObservable(key);
    self.value = ko.protectedObservable(value);
}

// Overall viewmodel for this screen, along with initial state
function ConfViewModel(test) {
    var self = this;
    self.hostIdentification = ko.observable();
    self.properties = ko.observableArray([]);
    self.selectedProperty = ko.observable();
    self.editing = ko.observable(false);

    /*
    //Set fake initial state...
    self.hostIdentification = ko.observable(new HostIdentification("testConf", "a.b.c", "127.0.0.1", "http://a.b.c/url"));

    self.properties = ko.observableArray([
        new Property("key1", "value1"),
        new Property("key2", "value2"),
        new Property("key3", "value3")
    ]);
    */
    
    // Load initial state from server, convert it to Property/HostIdentification instances, populate observables
    $.getJSON("/conf/testConf", function(allData) {
        var h = allData.hostIdentification;
        var mappedHostIdentification = new HostIdentification(h.friendlyName, h.fqdn, h.ip, h.url);
        console.log(mappedHostIdentification);
        var mappedProperties = $.map(allData.properties, function(p) { 
            var keyName = Object.keys(p)[0];
            return new Property(keyName, p[keyName]);
        });

        self.hostIdentification(mappedHostIdentification);
        self.properties(mappedProperties);
    });
         
    // Behaviors
    self.edit = function() { self.editing(true) };
    self.editProperty = function(toEdit) {
        self.selectedProperty(toEdit);
    }

    self.addProperty = function() {
        var newProperty = new Property("", "");
        self.properties.push(newProperty);
        self.selectedProperty(newProperty);
    }
    
    self.removeProperty = function(property) {
        self.properties.destroy(property);
        self.selectedProperty(null);
    }

    self.acceptPropertyEdit = function() {
        self.selectedProperty().key.commit();
        self.selectedProperty().value.commit();
        self.selectedProperty(null);
    };

    self.cancelPropertyEdit = function() {
        self.selectedProperty().key.reset();
        self.selectedProperty().value.reset();
        self.selectedProperty(null);
    };

    self.templateToUse = function(property) {
        return self.selectedProperty() === property ? "editTemplate" : "propertyTemplate";
    };

    self.persistedProperties = ko.computed(function() {
        return ko.utils.arrayFilter(self.properties(), function(property) { return !property._destroy});
    });

    self.saveHostIdentification = function() {
        $.ajax("/conf/testConf/host", {
            data: ko.toJson({properties: self.properties}),
            type: "PUT",
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
    };

    self.saveProperties = function() {
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
    };
}
