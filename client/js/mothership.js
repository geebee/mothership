var mothership = (function(){
    // Private Methods and Variables
    /*
    var privateVar = 'private';
    function alertPrivate(){
        alert(privateVar);
    }
    */

    // Public Methods and Variables (can acess the private variables and methods)
    return {
        /*
        publicMethod:function(){
            alertPrivate();
        },
        */
        nbVM: null,
        gdVM: null,
        udVM: null,
        cVM: null
    }
})()
