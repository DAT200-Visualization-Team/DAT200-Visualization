var queue;
var codeDisplayManager;
var elementToRemove = null;

$(document).ready(function () {
    if (queue == null) {
        codeDisplayManager = new CodeDisplayManager("javascript", "queue");
        initQueue([1, 2, 3, 4, 5]);
    }
});

function initQueue(array) {
    $('#queue').empty();
    queue = new Queue();

    if (array == null)
        array = [0, 1, 2, 3, 4, 5];

    array.forEach(function (value) {
        queue.enqueue(value);
        $('#queue').prepend('<div class="queue-entry element red lighten-3 z-depth-3 valign-wrapper"><h4 class="queue-value center-align truncate noselect valign">'
            + value + '</h4></div>');
    });
}

function enqueue(value) {
    cleanUpDequeuedElement();
    codeDisplayManager.loadFunctions("enqueue");
    codeDisplayManager.changeFunction("enqueue");

    appendCodeLines([0], codeDisplayManager);
    if (queue.currentSize === queue.theArray.length)
        appendCodeLines([1], codeDisplayManager);

    queue.enqueue(value);

    appendCodeLines([4], codeDisplayManager);

    var newElement = $('<div class="queue-entry element red lighten-3 z-depth-3 valign-wrapper" style="opacity: 0; display: none;"><h4 class="queue-value center-align truncate noselect valign">'
        + value + '</h4></div>').prependTo(('#queue'));

    appendAnimation(5, [{ e: newElement, p: [{x: '-500px'}, { display: 'inline-block', opacity: 1, x: 0, ease: Power4.easeOut }], o: { duration: 2 } }], codeDisplayManager);
    appendCodeLines([6], codeDisplayManager);

    //var loadingSequence = [];

    //for (var i = 0; i < arguments.length; i++) {
    //    loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(0, 500));
    //    if (queue.currentSize === queue.theArray.length)
    //        loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(1, 500));

    //    queue.enqueue(arguments[i]);

    //    loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(3, 500))
    //    var newElement = $('<div class="queue-entry element red lighten-3 z-depth-3 valign-wrapper" style="opacity: 0; display: none;"><h4 class="queue-value center-align truncate noselect valign">' + arguments[i] + '</h4></div>').prependTo(('#queue'));

    //    loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(4, 500))
    //    loadingSequence.push({ e: newElement, p: { translateX: [0, -500], opacity: 1 }, o: { duration: 2000, display: 'inline-block' } });

    //    loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(5, 500));
    //}
    //$.Velocity.RunSequence(loadingSequence);
}

function dequeue() {
    cleanUpDequeuedElement();
    codeDisplayManager.loadFunctions("dequeue");
    codeDisplayManager.changeFunction("dequeue");

    try {
        appendCodeLines([0], codeDisplayManager);
        queue.dequeue();
        appendCodeLines([4,5], codeDisplayManager);

        var element = $('#queue').children().last();

        appendAnimation(6, [{ e: element, p: { x: '+=1000px', autoAlpha: 0, ease: Power3.easeIn }, o: { duration: 3 } }], codeDisplayManager);

        appendCodeLines([7], codeDisplayManager);

        elementToRemove = element;
    }
    catch (e) {
        appendCodeLines([1], codeDisplayManager);
    }
}

function cleanUpDequeuedElement() {
    if (elementToRemove != null)
        elementToRemove.remove();

    elementToRemove = null;
}

function processUploadedObject(object) {
    queue = new Queue();
    initQueue(object.Queue.theArray.slice(0, object.Queue.currentSize));
    console.log(object.Queue.theArray.slice(0, object.Queue.currentSize))
    queue.theArray = object.Queue.theArray;
    queue.currentSize = object.Queue.currentSize;
    queue.front = object.Queue.front;
    queue.back = object.Queue.back;
}

$('#download-button, #download-button-mobile').on('click', function () {
    downloadObjectJson(queue);
});