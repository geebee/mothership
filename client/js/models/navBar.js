// Overall viewmodel for this screen, along with initial state
function NavBarViewModel() {
    var self = this;

    this.searchFocused = ko.observable(true);

    // Focus Search {{{
    this.focusSearch = function(focus) { 
        if (focus === false) {
            this.searchFocused(false);
        } else {
            this.searchFocused(true);
        }
    }; //}}}

}
