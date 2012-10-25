exports.preSave = function() {
    console.log("In Common Pre-Save Hook.");
};

exports.v_greaterThanOneCharacter = function(value){
    //Assert value length is >1
    return (value !== undefined && value.length > 1);
};
