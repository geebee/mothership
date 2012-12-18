var mothership = (function(){
    // Private Methods and Variables {{{
    var isAuthenticated = false;

    function privateMethod(){
        return true;
    }
    // }}}

    // Public Methods and Variables (can acess the private variables and methods) {{{
    return {
        getAuthenticatedStatus: function() {
            if (isAuthenticated === true) {
                return true;
            } else {
                return false;
            }
        },
        nbVM: null,
        gdVM: null,
        udVM: null,
        cVM: null
    } // }}}
})()
