function toggleFadeState(element) {
    element.fadeToggle(200, function () {
        if (element.css('display') != 'none')
            element.css('display', 'table-cell');
    });
}

function handleFunctionSubmit(event, functionName, formElement) {
    event.preventDefault();
    var argumentValuesArray = [];
    var allInputs = formElement.find(':input');

    for (var i = 0; i < allInputs.length; i++) {
        var type = allInputs[i].getAttribute('data-type');
        var value = allInputs[i].value;

        switch (type) {
            case 'array':
                argumentValuesArray.push(JSON.parse('[' + value + ']'));
                break;
            case 'int':
                argumentValuesArray.push(Number.parseInt(value));
                break;
            case 'float':
                argumentValuesArray.push(Number.parseFloat(value));
                break;
            case 'string':
            default:
                argumentValuesArray.push(value);

        }
    }
    window[functionName].apply(this, argumentValuesArray);

    toggleFadeState($('#command-items-wrapper'));
}

$(document).mouseup(function (e) {
    var commandPopup = $('#command-items-wrapper');
    if (!$('#expand-tab').is(e.target) && $('#expand-tab').has(e.target).length == 0 && !commandPopup.is(e.target) && commandPopup.has(e.target).length == 0) {
        if($('#command-items-wrapper').css('display') != 'none')
            toggleFadeState($('#command-items-wrapper'));
    }
});