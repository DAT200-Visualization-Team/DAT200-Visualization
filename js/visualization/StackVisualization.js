var stack;

$(document).ready(function () {
    if (stack == null) {
        stack = new Stack();
        initStack();
    }
});

function initStack(arrayList) {
    $('#stack').empty();

    if (arrayList == null || !(arrayList.constructor.name === 'ArrayList')) {
        arrayList = new ArrayList([1, 2, 3, 4, 5]);
    }

    animatePushes(arrayList.theItems);
}

function pushElement(value) {
    animatePushes(value);
}

function popElement() {
    animatePops(1);
}

function animatePushes(values) {
    var loadingSequence = [];

    if (values == null)
        values = [null];

    if (!(values instanceof Array)) {
        var tmp = values;
        values = [values];
    }

    for (var i = 0; i < values.length; i++) {
        var currentElement = $('<div class="stack-entry red lighten-3 z-depth-3" style="opacity: 0;"><h4 class="stack-value center-align truncate noselect">' + values[i] + '</h4></div>').prependTo('#stack');
        loadingSequence.push({ e: currentElement, p: { translateY: [0, -500], opacity: 1 }, o: { duration: 1000, easing: 'linear' } });
        stack.push(values[i]);
    }

    $.Velocity.RunSequence(loadingSequence);
}

function animatePops(count) {
    $('#code-text').html(popLines);

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();

    var loadingSequence = [];
    var lines = $('.code-line');
    if (count == null) {
        count = 1;
    }

    for (var i = 0; i < count; i++) {

        loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
        try {
            stack.pop()
            loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });

            var currentElement = $('#stack').children().eq(i);

            loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({
                e: currentElement, p: { translateX: generateRandomNumberInRange(-100, 100), translateY: generateRandomNumberInRange(-100, -40) },
                o: { duration: 1500, easing: 'easeOutQuad' },
            });
            
            loadingSequence.push({
                e: currentElement, p: { translateX: pickRandomNumber(-5000, 5000) },
                o: { duration: 1000, easing: 'easeInSine', complete: function (elements) { elements[0].remove() } },
            });
            loadingSequence.push({ e: lines[2], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
        }
        catch (err) {
            loadingSequence.push({ e: lines[0], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[1], p: { backgroundColorAlpha: 1 }, o: { duration: 500 } });
            loadingSequence.push({ e: lines[1], p: { backgroundColorAlpha: 0 }, o: { duration: 500 } });
            break;
        }
    }

    $.Velocity.RunSequence(loadingSequence);
}

function generateRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function pickRandomNumber() {
    var index = Math.floor(Math.random() * arguments.length)
    return arguments[index];
}

function makeElementsEmpty() {
    animatePops(stack.arrayList.size());
}

function processUploadedObject(object) {
    var arrayList = new ArrayList(object.Stack.arrayList.theItems);
    arrayList.modCount = object.Stack.arrayList.modCount;
    arrayList.theSize = object.Stack.arrayList.theSize;
    arrayList.capacity = object.Stack.arrayList.capacity;
    stack = new Stack();
    stack.arrayList = arrayList;
    initStack(arrayList);
}

$('#download-button, #download-button-mobile').on('click', function () {
    downloadObjectJson(stack);
});

$('#push-input').keyup(function (event) {
    if (event.keyCode == 13) {
        pushElement($('#push-input').val());
    }
});

var popLines = 'Stack.prototype.pop = function () {\n\t<span class="code-line" style="background-color: rgba(255,255,0,0);">if(this.isEmpty())</span>\n\t\t<span class="code-line" style="background-color: rgba(255,255,0,0);">throw { name: "UnderflowException", message: "ArrayList is empty" };</span>\n\t<span class="code-line" style="background-color: rgba(255,255,0,0);">return this.arrayList.removeAtPos(this.arrayList.size() - 1);</span>\n}'