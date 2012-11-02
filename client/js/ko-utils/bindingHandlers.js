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
        var editField = document.createElement("span");
        var input = document.createElement("input");
            input.setAttribute("placeholder", pObservable());
        var acceptButton = document.createElement("i");
            acceptButton.className = "icon-ok";
        var cancelButton = document.createElement("i");
            cancelButton.className = "icon-repeat";
            
        editField.appendChild(input);
        editField.appendChild(acceptButton);
        editField.appendChild(cancelButton);

        element.appendChild(link);
        element.appendChild(editField);

        pObservable.editing = ko.observable(false);
        pObservable.focused = ko.observable(false);

        ko.applyBindingsToNode(acceptButton, {
            click: function() {
                pObservable.commit();
                pObservable.editing(false);
                pObservable.focused(false);
            }
        });

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
