var queue;
var codeDisplayManager;

$(document).ready(function () {
    if (queue == null) {
        queue = new Queue();
        codeDisplayManager = new CodeDisplayManager("javascript", "queue");
        initQueue([1, 2, 3, 4, 5]);
    }
});

function initQueue(array) {
    $('#queue').empty();

    if (array == null)
        array = [0, 1, 2, 3, 4, 5];

    enqueue.apply(null, array);
}

function enqueue() {
    codeDisplayManager.loadFunctions("enqueue");
    codeDisplayManager.changeFunction("enqueue");

    var loadingSequence = [];

    for (var i = 0; i < arguments.length; i++) {
        loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(0, 500));
        if (queue.currentSize === queue.theArray.length)
            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(1, 500));

        queue.enqueue(arguments[i]);

        loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(3, 500))
        var newElement = $('<div class="queue-entry element red lighten-3 z-depth-3 valign-wrapper" style="opacity: 0; display: none;"><h4 class="queue-value center-align truncate noselect valign">' + arguments[i] + '</h4></div>').prependTo(('#queue'));

        loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(4, 500))
        loadingSequence.push({ e: newElement, p: { translateX: [0, -500], opacity: 1 }, o: { duration: 2000, display: 'inline-block' } });

        loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(5, 500));
    }
    $.Velocity.RunSequence(loadingSequence);
}

function dequeue(count) {
    codeDisplayManager.loadFunctions("enqueue");
    codeDisplayManager.changeFunction("enqueue");

    var loadingSequence = [];

    if (count == null)
        count = 1;

    for (var i = 0; i < count; i++) {
        try {
            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(0, 500));
            queue.dequeue();

            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(3, 500));
            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(4, 500));

            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(5, 500));
            var elementToRemove = $('.queue-entry').eq(queue.currentSize);
            loadingSequence.push({
                e: elementToRemove, p: { translateX: '+=1000px' }, o: {
                    duration: 1000, easing: 'easeInSine',
                    complete: function (elements) { elements[0].remove() }
                }
            });
        }
        catch (err) {
            loadingSequence = loadingSequence.concat(codeDisplayManager.getVelocityFramesForHighlight(1, 500));
            break;
        }
    }

    $.Velocity.RunSequence(loadingSequence);
}

function doubleQueue() {

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