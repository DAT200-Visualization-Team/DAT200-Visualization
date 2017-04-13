// Due to the fact that jQuery toggles the 
function toggleCommandVisibility() {
    var commandList = $('#command-items-wrapper');
    var visibility = commandList.css('visibility');
    if (visibility == 'hidden') {
        commandList.fadeTo(500, 1, function () {
            commandList.css('visibility', 'visible');
        });
    }
    else {
        commandList.fadeTo(500, 0, function () {
            commandList.css('visibility', 'hidden');
        });
    }
}

function handleFunctionSubmit(functionName, formElement) {
    event.preventDefault();
    var argumentValuesArray = [];
    var allInputs = formElement.find(':input');

    for (var i = 0; i < allInputs.length; i++) {
        console.log(allInputs[i]);
        var type = allInputs[i].getAttribute('data-type');
        var value = allInputs[i].value;
        console.log("value",value);

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
}