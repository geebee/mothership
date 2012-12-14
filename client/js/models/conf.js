// Class to represent a version of the conf {{{
function Version(number, timestamp) {
    this.number = number;
    this.timestamp = timestamp;
} //}}}
// Class to represent a host identification entry {{{
function HostIdentification(friendlyName, fqdn, ip, url, environment) {
    this.friendlyName = friendlyName;
    this.fqdn = ko.protectedObservable(fqdn);
    this.ip = ko.protectedObservable(ip);
    this.url = ko.protectedObservable(url);
    this.environment = ko.protectedObservable(environment);
    this.focused = ko.observable();
} // }}}
// Class to represent an individual property entry //{{{
function Property(key, value) {
    this.key = ko.protectedObservable(key);
    this.key.focused = ko.observable();
    this.value = ko.protectedObservable(value);
}//}}}

// Overall viewmodel for this screen, along with initial state
function ConfViewModel() {
    var self = this;

    this.confLoaded = ko.observable('none');
    //this.newConf = ko.observable('none');
    this.guestHome = ko.observable('block');
    //this.authenticatedHome = ko.observable('none');
    
    this.totalConfigs = ko.observable(0);
    this.totalRevisions = ko.observable(0);
    this.totalEnvironments = ko.observable(0);

    this.hostIdentification = ko.observable();
    this.friendlyName = "";
    this.properties = ko.observableArray([]);
    this.currentVersion = ko.observable(0);
    this.versions = ko.observableArray([]);

    this.selectedElement = ko.observable();
    this.searchFocused = ko.observable(true);

    this.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Behaviors

    // Focus Search {{{
    this.focusSearch = function(focus) { 
        if (focus === false) {
            this.searchFocused(false);
        } else {
            this.searchFocused(true);
        }
    }; //}}}

    // Add and remove properties {{{
    this.addProperty = function() {
        var newProperty = new Property("", "");
        self.properties.push(newProperty);
        self.selectedElement(newProperty);
        newProperty.key.focused(true);
    };
    
    this.removeProperty = function(property) {
        self.properties.destroy(property);
        self.selectedElement(null);
    }; //}}}

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
        var row = e.target.parentNode.parentNode;
        console.log("row...");
        console.dir(row);
        $(row).addClass("info");

        self.upsertKeyValue(self.friendlyName, kvObject, $(e.target.parentElement.parentElement));
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

    // View/Edit Template Switcher {{{
    this.templateToUse = function(property) {
        return self.selectedElement() === property ? "editTemplate" : "viewTemplate";
    }; //}}}

    // Computed Observables {{{
    this.destroyedProperties = ko.computed(function() {
        return ko.utils.arrayFilter(self.properties(), function(property) { return property._destroy});
    });
    // }}}

    // Load totalConfigs and totalRevisions for dashboard {{{
    this.totalConfsAndRevisions = function(friendlyName){
        console.log("Loading total confs and revisions");
        $.getJSON("/dashboard/totals", function(totals) {
            self.totalConfigs(totals.configs);
            self.totalRevisions(totals.revisions);
            self.totalEnvironments(totals.environments);
        });
    }; //}}}

    // Load initial state from server, map to Property/HostIdentification instances, populate observables {{{
    this.loadConf = function(friendlyName){
        self.friendlyName = friendlyName;
        console.log("loadConf - friendlyName: %s", friendlyName); 
        $.getJSON("/conf/" + friendlyName, function(allData) {
            console.dir(allData);
            var h = allData.hostIdentification;
            var mappedHostIdentification = new HostIdentification(h.friendlyName, h.fqdn, h.ip, h.url, h.environment);
            console.dir(allData.properties);
            if (!(allData.properties instanceof Array)) {
                var mappedProperties = [];
                mappedProperties.push(new Property(allData.properties.key, allData.properties.value));
            } else {
                var mappedProperties = $.map(allData.properties, function(p) { 
                    return new Property(p.key, p.value);
                });
            }

            self.currentVersion(allData.v);
            self.hostIdentification(mappedHostIdentification);
            self.properties(mappedProperties);

            self.guestHome('none');
            self.confLoaded('block');
        });
    }; //}}}

    // Load Previous Versions of the Conf {{{
    this.loadVersions = function(){
        console.log("loadVersions - friendlyName: %s", self.friendlyName); 
        $.getJSON("/conf/" + self.friendlyName + "/versions", function(allData) {
            console.dir(allData);
            var mappedVersions = $.map(allData, function(v) { 
                var timestampDate = new Date(v.timestamp);
                var friendlyTimestamp = self.shortMonths[timestampDate.getMonth()]  + timestampDate.getDate() + " - " + timestampDate.getHours() + (timestampDate.getMinutes() < 10 ? "0" + timestampDate.getMinutes() : timestampDate.getMinutes());
                return new Version(v.version, friendlyTimestamp);
            });
            self.versions(mappedVersions);
        });
    };//}}}

    // Delete loaded config from the server {{{
    this.deleteConf = function(e) {
        console.log("deleteConf - friendlyName: %s", e.friendlyName); 

        $("#hostInformationArea").addClass("success-border");
        setTimeout(function(){
            $("#hostInformationArea").removeClass("success-border");
        }, 2000);
        
        // $("#home a").click();
            
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
    this.upsertKeyValue= function(friendlyName, kvObject, rowElement) {
        console.log("upsertKeyValue - friendlyName: %s, kvObject: {%s: %s}", friendlyName, kvObject.key, kvObject.value); 
        console.log("rowElement: %s", rowElement);
        $.ajax("/conf/" + friendlyName + "/property", {
            processData: false,
            data: ko.toJSON({"friendlyName": friendlyName, "toUpdate": kvObject}),
            type: "PUT",
            contentType: "application/json",
            success: function(result) { 
                console.log("success.");
                console.log(result);
                self.currentVersion += 1;
                $(rowElement).addClass("success");
                setTimeout(function(){
                    $(rowElement).removeClass("success");
                }, 2000);
            },
            failure: function(result) {
                console.log("failure.");
                console.log(result);
                $("#propertyArea table").addClass("error");
                setTimeout(function(){
                    $("#propertyArea table").removeClass("error");
                }, 2000);
            }
        });
    }; //}}}
}
