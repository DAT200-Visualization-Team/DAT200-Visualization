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

CodeDisplayManager.prototype.highlightNextLine = function (highlightTime) {
    this.highlightLine(this.currentLine, highlightTime);
    this.currentLine++;
};

CodeDisplayManager.prototype.highlightLine = function (index, highlightTime) {
    if (highlightTime == null)
        highlightTime = 1000;

    var lineToDisplay = $("#" + this.currentFunction).find(".highlighted-code");

    $.Velocity.RunSequence([
        { e: lineToDisplay[index], p: { backgroundColorAlpha: 1 }, o: { duration: highlightTime / 2 } },
        { e: lineToDisplay[index], p: { backgroundColorAlpha: 0 }, o: { duration: highlightTime / 2 } }
    ]);

    this.currentLine = index++;
};