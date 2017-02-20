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
        }
    });
}

CodeDisplayManager.prototype.loadFunctions = function () {
    $("#code-text").empty();
    for (var i = 0; i < arguments.length; i++) {
        $("#code-text").append("<span id='" + arguments[i] + "'>" + this.currentClass[arguments[i]].header + "\n")
        for(var j = 0; j < this.currentClass[arguments[i]].lines.length; j++)
            $("#" + arguments[i]).append(this.makeHighlightSpan(this.currentClass[arguments[i]].lines[j]));

        $("#code-text").append("}</span></span>\n\n");
    }

    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
};

CodeDisplayManager.prototype.makeHighlightSpan = function (line) {
    var textStartIndex = line.search(/\S|$/);
    return line.slice(0, textStartIndex) + "<span class='highlighted-code' style='background-color: rgba(255,255,0,0);'>" + line.slice(textStartIndex) + "</span>\n"
};

CodeDisplayManager.prototype.changeFunction = function (functionName, line) {
    if (line == null)
        line = 0;

    this.currentFunction = functionName;
    this.currentLine = line;
}

CodeDisplayManager.prototype.highlightNextLine = function (highlightTime, initialDelay) {
    this.highlightLine(this.currentLine, highlightTime, initialDelay);
    this.currentLine++;
};

CodeDisplayManager.prototype.highlightLine = function (index, highlightTime, initialDelay) {
    $.Velocity.RunSequence(this.getVelocityFramesForHighlight(index, highlightTime, initialDelay));
};

CodeDisplayManager.prototype.getVelocityFramesForHighlight = function (index, highlightTime, initialDelay) {
    if (highlightTime == null) highlightTime = 1000;
    if (initialDelay == null) initialDelay = 0;

    var lineToDisplay = $("#" + this.currentFunction).find(".highlighted-code");

    this.currentLine = index++;

    return [
        { e: lineToDisplay[index - 1], p: { backgroundColorAlpha: 1 }, o: { duration: highlightTime / 2, delay: initialDelay } },
        { e: lineToDisplay[index - 1], p: { backgroundColorAlpha: 0 }, o: { duration: highlightTime / 2 } }
    ];
}