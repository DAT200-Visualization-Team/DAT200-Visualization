var queue;

$(document).ready(function () {
    if (queue == null) {
        queue = new Queue();
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
    $('#code-text').html(enqueueHtml);

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
    var lines = $('.code-line');

    var loadingSequence = [];

    for (var i = 0; i < arguments.length; i++) {
        loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
        queue.enqueue(arguments[i]);
        loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

        loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
        var newElement = $('<div class="queue-entry element red lighten-3 z-depth-3" style="opacity: 0; display: none;"><h4 class="queue-value truncate noselect">' + arguments[i] + '</h4></div>').prependTo(('#queue'));
        loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

        loadingSequence.push({ e: lines[3], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
        loadingSequence.push({ e: newElement, p: { translateX: [0, -500], opacity: 1 }, o: { duration: 500, display: 'inline-block' } });
        loadingSequence.push({ e: lines[3], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

        loadingSequence.push({ e: lines[4], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
        loadingSequence.push({ e: lines[4], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
    }

    $.Velocity.RunSequence(loadingSequence);
}

function dequeue(count) {
    $('#code-text').html(dequeueHtml);

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();

    var loadingSequence = [];
    var lines = $('.code-line');

    if (count == null)
        count = 1;

    for (var i = 0; i < count; i++) {
        try {
            loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
            queue.dequeue();

            loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

            loadingSequence.push({ e: lines[3], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[3], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

            loadingSequence.push({ e: lines[4], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            var elementToRemove = $('.queue-entry').eq(queue.currentSize);
            loadingSequence.push({
                e: elementToRemove, p: { translateX: '+=1000px' }, o: {
                    duration: 1000, easing: 'easeInSine',
                    complete: function (elements) { elements[0].remove() }
                }
            });
            loadingSequence.push({ e: lines[4], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

            loadingSequence.push({ e: lines[5], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[5], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
        }
        catch (err) {
            loadingSequence.push({ e: lines[1], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[1], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
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

var enqueueHtml = [
    'Queue.prototype.enqueue = function(x) {\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">if (this.currentSize === this.theArray.length) {</span>\n',
    '\t\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.doubleQueue();</span>\n',
    '\t}\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.back = this.increment(this.back);</span>\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.theArray[this.back] = x;</span>\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.currentSize++;</span>\n',
    '};'
]

var dequeueHtml = [
    'Queue.prototype.dequeue = function() {\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">if(this.isEmpty()) {</span>\n',
    '\t\t<span class="code-line" style="background-color: rgba(255,255,0,0);">throw {name: "UnderflowException", message: "Queue is empty (dequeue)"};</span>\n',
    '\t}\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.currentSize--;</span>\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">var returnVal = this.theArray[this.front];</span>\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">this.front = this.increment(this.front);</span>\n',
    '\t<span class="code-line" style="background-color: rgba(255,255,0,0);">return returnVal;</span>\n',
    '};'
]