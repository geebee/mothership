ko.bindingHandlers.hidden = {
    update: function(element, valueAccessor) {
        var isVisible = !ko.utils.unwrapObservable(valueAccessor());
        ko.bindingHandlers.visible.update(element, function() { return isVisible; });
    }        
};

ko.bindingHandlers.clickToEdit = {
    init: function(element, valueAccessor) {
        var pObservable = valueAccessor();

        var link = document.createElement("a");
        var editField = document.createElement("div");
            editField.className = "control-group hiEdit";
        var editFieldControls = document.createElement("div");
            editFieldControls.className = "controls";
        var input = document.createElement("input");
            input.setAttribute("placeholder", pObservable());
        var statusMessage = document.createElement("span");
            statusMessage.className = "help-inline";
        var acceptButton = document.createElement("i");
            acceptButton.className = "icon-ok";
        var cancelButton = document.createElement("i");
            cancelButton.className = "icon-repeat";
            
        editFieldControls.appendChild(input);
        editFieldControls.appendChild(statusMessage);
        editFieldControls.appendChild(acceptButton);
        editFieldControls.appendChild(cancelButton);
        editField.appendChild(editFieldControls);

        element.appendChild(link);
        element.appendChild(editField);

        pObservable.editing = ko.observable(false);
        pObservable.focused = ko.observable(false);

        ko.applyBindingsToNode(acceptButton, {
            click: function() {
                //console.log("cVM: %s", cVM);
                pObservable.commit();
                cVM.saveHostIdentification(cVM.hostIdentification().friendlyName(), function(res, textStatus){
                    console.log("updated successfully.");
                    //$("#hostInformationArea div.control-group i").filter(":visible").hide();
                    $("#hostInformationArea div.control-group").filter(":visible").addClass("success");
                    $("#hostInformationArea div.control-group span.help-inline").filter(":visible").text("Updated.");
                    setTimeout(function(){
                        //$("#hostInformationArea div.control-group i").filter(".show();
                        pObservable.editing(false);
                        pObservable.focused(false);
                        $("#hostInformationArea div.control-group").removeClass("success");
                        $("#hostInformationArea div.control-group span.help-inline").text("");
                    }, 2000);
                },
                function(res, textStatus){
                    console.log("update failed.");
                    $("#hostInformationArea div.control-group").addClass("error");
                    $("#hostInformationArea div.control-group span.help-inline").text("Error.");
                });
            }
        }, cVM);

        ko.applyBindingsToNode(cancelButton, {
            click: function() {
                pObservable.reset();
                pObservable.editing(false);
                pObservable.focused(false);
            }
        });

        ko.applyBindingsToNode(link, {
            text: pObservable,
            hidden: pObservable.editing,
            click: function() {
                pObservable.editing(true);
                pObservable.focused(true);
            }
        });

        //Apply 'editing' to the whole span
        ko.applyBindingsToNode(editField, {
            visible: pObservable.editing,
        });
        //Apply the value and the hasfocus bindings to the input field
        ko.applyBindingsToNode(input, {
            value: pObservable,
            hasfocus: pObservable.focused
        });
    }
};
