function initStack(values) {
    $('#stack').empty();

    if (values == null || !(values instanceof Array))
        values = [1, 2, 3, 4, 5];

    for (var i = 0; i < values.length; i++) {
        pushElement(values[i]);
    }
}

function pushElement(value) {
    $('#stack').prepend('<div class="stack-entry"><h4 class="stack-value center-align">' + value + '</h4></div>');
}

function popElement() {
    $('#stack').children().first().remove();
}