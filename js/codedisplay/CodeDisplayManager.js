function CodeDisplayManager(language, algorithmOrDataStructure) {

    this.codeRoot;
    this.currentClass;
    this.currentFunction;
    this.currentLine;

    var self = this;

    $.ajax({
        url: "./js/codedisplay/code.json",
        dataType: "json",
        async: false,
        success: function (data) {
            self.codeRoot = data;
            self.currentClass = data[language][algorithmOrDataStructure];
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

CodeDisplayManager.prototype.loadFunctions = function () {
    $("#code-text").empty();
    for (var i = 0; i < arguments.length; i++) {
        $("#code-text").append("<span id='" + arguments[i] + "'>" + this.currentClass[arguments[i]].header + "\n");
        for(var j = 0; j < this.currentClass[arguments[i]].lines.length; j++)
            $("#" + arguments[i]).append(this.makeHighlightSpan(this.currentClass[arguments[i]].lines[j]));

        $("#code-text").append("\n\n");
    }

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
    this.addVariableTooltips();
};

CodeDisplayManager.prototype.makeHighlightSpan = function (line) {
    var textStartIndex = line.search(/\S|$/);
    return line.slice(0, textStartIndex) + "<span class='highlighted-code' style='background-color: rgba(255,255,0,0);'>" + line.slice(textStartIndex) + "</span>\n"
};

CodeDisplayManager.prototype.addVariableTooltips = function () {
    var words = ["arrayList", "element"]

    var regexp = new RegExp('( ?' + words.join('?| ?') + '?)', 'g');

    var text = $("#code-text").html();

    text = text.replace(regexp, '<span class="tooltip-$& variable" title="This is a tooltip">$&</span>')

    $("#code-text").html(text);

    $(".variable").qtip({
        style: { classes: "qtip-tipsy" }
    })
}

CodeDisplayManager.prototype.changeFunction = function (functionName, line) {
    if (line == null)
        line = 0;

    this.currentFunction = functionName;
    this.currentLine = line;
};

CodeDisplayManager.prototype.highlightNextLine = function (highlightTime, initialDelay) {
    this.highlightLine(this.currentLine, highlightTime, initialDelay);
    this.currentLine++;
};

CodeDisplayManager.prototype.highlightLine = function (index, highlightTime, initialDelay) {
    $.Velocity.RunSequence(this.getVelocityFramesForHighlight(index, highlightTime, initialDelay));
};

CodeDisplayManager.prototype.getHighlightInfo = function (index, highlightTime) {
    if (highlightTime == null) highlightTime = 1000;

    var lineToDisplay = $("#" + this.currentFunction).find(".highlighted-code");

    this.currentLine = index++;

    return [
        { e: lineToDisplay[index - 1], p: { backgroundColor: 'rgba(255,255,0,1)' }, o: { duration: highlightTime / 2 } },
        { e: lineToDisplay[index - 1], p: { backgroundColor: 'transparent' }, o: { duration: highlightTime / 2 } }
    ];
};

CodeDisplayManager.prototype.getMultiHighlightInfo = function (indexArray, highlightTime) {
    var frames = [];

    for (var i = 0; i < indexArray.length; i++) {
        frames = frames.concat(this.getHighlightInfo(indexArray[i], highlightTime));
    }

    return frames;
};