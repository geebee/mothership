// Overall viewmodel for this screen, along with initial state
function GuestDashboardViewModel() {
    var self = this;

    this.guestHome = ko.observable('block');

    this.totalConfigs = ko.observable(0);
    this.totalRevisions = ko.observable(0);
    this.totalEnvironments = ko.observable(0);

    // Load totalConfigs and totalRevisions for dashboard {{{
    this.totalConfsAndRevisions = function(friendlyName){
        console.log("Loading total confs and revisions");
        $.getJSON("/dashboard/totals", function(totals) {
            self.totalConfigs(totals.configs);
            self.totalRevisions(totals.revisions);
            self.totalEnvironments(totals.environments);
        });
    }; //}}}
}
