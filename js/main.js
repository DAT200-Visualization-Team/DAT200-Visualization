function handleFunctionSubmit(functionName, formElement) {
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
}