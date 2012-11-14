// Class to represent a host identification entry//{{{
function HostIdentification(friendlyName, fqdn, ip, url) {
    //this.friendlyName = ko.protectedObservable(friendlyName);
    this.friendlyName = friendlyName;
    this.fqdn = ko.protectedObservable(fqdn);
    this.ip = ko.protectedObservable(ip);
    this.url = ko.protectedObservable(url);
    this.focused = ko.protectedObservable();
}//}}}
// Class to represent an individual property entry //{{{
function Property(key, value) {
    this.key = ko.protectedObservable(key);
    this.key.focused = ko.observable();
    this.value = ko.protectedObservable(value);
}//}}}

// Overall viewmodel for this screen, along with initial state
function ConfViewModel() {
    var self = this;
    this.hostIdentification = ko.observable();
    this.friendlyName = "";
    this.properties = ko.observableArray([]);
    this.selectedElement = ko.observable();
    this.searchFocused = ko.observable(true);
    this.focusSearch = function(focus) { 
        if (focus === false) {
            this.searchFocused(false);
        } else {
            this.searchFocused(true);
        }
    };

    /*//{{{ Set fake initial state...
    self.hostIdentification = ko.observable(new HostIdentification("testConf", "a.b.c", "127.0.0.1", "http://a.b.c/url"));

    self.properties = ko.observableArray([
        new Property("key1", "value1"),
        new Property("key2", "value2"),
        new Property("key3", "value3")
    ]);
    *///}}}
    
    // Behaviors
    // Add and remove properties//{{{
    this.addProperty = function() {
        var newProperty = new Property("", "");
        self.properties.push(newProperty);
        self.selectedElement(newProperty);
        newProperty.key.focused(true);
    };
    
    this.removeProperty = function(property) {
        self.properties.destroy(property);
        self.selectedElement(null);
    };//}}}

    // Edit Property, Accept/Cancel Property Edits {{{
    this.editElement = function(item) {
        self.selectedElement(item);
        item.key.focused(true);
    };

    this.acceptElementEdit = function(i, e) {
        self.selectedElement().key.commit();
        self.selectedElement().value.commit();
        self.selectedElement(null);
        var kvObject = ko.toJS(i);
        self.upsertKeyValue(self.friendlyName, kvObject);
    };

    this.cancelElementEdit = function() {
        self.selectedElement().key.reset();
        self.selectedElement().value.reset();
        self.selectedElement(null);
    }; //}}}

    // Table sorting functions {{{ 
    this.sortByKeys = function(i, e) {
        this.properties.sort(function(left, right) {
            return left.key == right.key ? 0 : (left.key < right.key ? -1 : 1)
        });

        var sortChanged = false;
        if ($(e.target).hasClass("noSort")) { 
            console.log("has noSort");
            $(e.target).removeClass("noSort").addClass("headerSortDown");
        };
        if ($(e.target).hasClass("headerSortDown") && !sortChanged) {
            console.log("has headerSortDown");
            $(e.target).removeClass("headerSortDown").addClass("headerSortUp");
            sortChanged = true;
        };
        if ($(e.target).hasClass("headerSortUp") && !sortChanged) {
            console.log("has headerSortUp");
            $(e.target).removeClass("headerSortUp").addClass("headerSortDown");
            sortChanged = true;
        };
            
    };

    this.sortByValues = function(i,e) {
        this.properties.sort(function(left, right) {
            return left.value == right.value ? 0 : (left.value < right.value ? -1 : 1)
        });

        var sortChanged = false;
        if ($(e.target).hasClass("noSort")) { 
            console.log("has noSort");
            $(e.target).removeClass("noSort").addClass("headerSortDown");
        };
        if ($(e.target).hasClass("headerSortDown") && !sortChanged) {
            console.log("has headerSortDown");
            $(e.target).removeClass("headerSortDown").addClass("headerSortUp");
            sortChanged = true;
        };
        if ($(e.target).hasClass("headerSortUp") && !sortChanged) {
            console.log("has headerSortUp");
            $(e.target).removeClass("headerSortUp").addClass("headerSortDown");
            sortChanged = true;
        };
    };//}}}

    this.templateToUse = function(property) {
        return self.selectedElement() === property ? "editTemplate" : "viewTemplate";
    };

    this.destroyedProperties = ko.computed(function() {
        return ko.utils.arrayFilter(self.properties(), function(property) { return property._destroy});
    });

    // Load initial state from server, map to Property/HostIdentification instances, populate observables {{{
    this.loadConf = function(friendlyName){
        self.friendlyName = friendlyName;
        console.log("loadConf - friendlyName: %s", friendlyName); 
        $.getJSON("/conf/" + friendlyName, function(allData) {
            var h = allData.hostIdentification;
            var mappedHostIdentification = new HostIdentification(h.friendlyName, h.fqdn, h.ip, h.url);
            console.dir(allData.properties);
            if (!(allData.properties instanceof Array)) {
                var mappedProperties = [];
                mappedProperties.push(new Property(allData.properties.key, allData.properties.value));
            } else {
                var mappedProperties = $.map(allData.properties, function(p) { 
                    return new Property(p.key, p.value);
                });
            }

            self.hostIdentification(mappedHostIdentification);
            self.properties(mappedProperties);

        });
    };//}}}

    // Delete loaded config from the server {{{
    this.deleteConf = function(e) {
        console.log("deleteConf - friendlyName: %s", e.friendlyName()); 

        $("#hostInformationArea").addClass("success-border");
        setTimeout(function(){
            $("#hostInformationArea").removeClass("success-border");
        }, 2000);
            
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
    };//}}}

    // Save hostIdentification part of the config {{{
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
    };//}}}

    // Update or insert a key/value pair on this config {{{
    this.upsertKeyValue= function(friendlyName, kvObject) {
        console.log("upsertKeyValue - friendlyName: %s, kvObject: {%s: %s}", friendlyName, kvObject.key, kvObject.value); 
        $.ajax("/conf/" + friendlyName + "/property", {
            processData: false,
            data: ko.toJSON({"friendlyName": friendlyName, "toUpdate": kvObject}),
            type: "PUT",
            contentType: "application/json",
            success: function(result) { 
                console.log("success.");
                console.log(result);
                //$("#propertyArea table tbody tr td").not(".buttons").addClass("control-group").addClass("success")
            },
            failure: function(result) {
                console.log("failure.");
                console.log(result);
                //$("#propertyArea table tbody tr td").not(".buttons").addClass("control-group").addClass("error")
            }
        });
    }; //}}}
}
